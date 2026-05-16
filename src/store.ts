import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dbService } from './services/db';
import { AppState, Account, UsageEvent } from './types';
import { isFirebaseConfigured, auth } from './firebase';

const COLORS = ['#C5A059', '#8E6F3E', '#7D7468', '#A68A64', '#582F0E', '#333D29', '#414833', '#656D4A'];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      accounts: [],
      usageHistory: [],
      toast: null,
      activeView: 'dashboard',
      searchQuery: '',
      selectedTag: 'all',
      selectedService: 'all',
      selectedStatus: 'all',
      selectedAccounts: [],
      theme: 'system',
      user: null,
      isAuthInitialized: false,
      apiKeys: {
        gemini: '',
        openai: '',
        anthropic: ''
      },

      setApiKey: (service, key) => set((state) => ({ 
        apiKeys: { ...state.apiKeys, [service]: key } 
      })),
      setSelectedService: (service) => set({ selectedService: service }),
      setSelectedStatus: (status) => set({ selectedStatus: status }),
      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
      logout: async () => {
        if (isFirebaseConfigured) {
          await auth.signOut();
        }
        set({ user: null, accounts: [], selectedAccounts: [], activeView: 'dashboard' });
      },

      // Initialize subscription
      initialize: () => {
        if (isFirebaseConfigured) {
          auth.onAuthStateChanged((user: any) => {
            if (user) {
              set({ user: { uid: user.uid, email: user.email }, isAuthInitialized: true });
              dbService.subscribeToAccounts(user.uid, (accounts) => {
                get().checkAndReset(accounts);
              });
            } else {
              set({ user: null, accounts: [], isAuthInitialized: true });
            }
          });
        } else {
          get().checkAndReset(get().accounts);
          set({ isAuthInitialized: true });
        }
      },

      checkAndReset: (accounts: Account[]) => {
        const now = Date.now();
        const expiredAccounts = accounts.filter(a => a.resetAt && a.resetAt <= now);
        const refreshingAccounts = accounts.filter(a => {
          if (!a.lastRefreshedAt) return false;
          const refreshTime = a.lastRefreshedAt + (a.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;
          return refreshTime <= now;
        });

        if (expiredAccounts.length > 0 || refreshingAccounts.length > 0) {
          let updatedAccounts = [...accounts];
          if (expiredAccounts.length > 0) {
            const expiredIds = new Set(expiredAccounts.map(a => a.id));
            updatedAccounts = updatedAccounts.map(acc => 
              expiredIds.has(acc.id) ? { ...acc, resetAt: null, exhaustedAt: null } : acc
            );
            dbService.bulkUpdate(expiredAccounts, { resetAt: null, exhaustedAt: null });
            get().showToast(`${expiredAccounts.length} accounts restored`);
          }
          if (refreshingAccounts.length > 0) {
            const refreshingIds = new Set(refreshingAccounts.map(a => a.id));
            updatedAccounts = updatedAccounts.map(acc => 
              refreshingIds.has(acc.id) ? { ...acc, lastRefreshedAt: now, health: 100 } : acc
            );
            dbService.bulkUpdate(refreshingAccounts, { lastRefreshedAt: now, health: 100 });
            refreshingAccounts.forEach(a => {
              get().showToast(`Quota Refreshed: ${a.name} is ready`);
            });
          }
          set({ accounts: updatedAccounts });
        } else {
          set({ accounts });
        }
      },

      markExhausted: async (id) => {
        const now = Date.now();
        const account = get().accounts.find(a => a.id === id);
        
        if (!account) return;

        // Calculate actual reset time based on refresh cycle
        const refreshTime = account.lastRefreshedAt + (account.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;
        // If the refresh time has already passed, we just give it the full cycle from now
        const resetAt = refreshTime > now ? refreshTime : now + (account.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;

        const updates = { 
          exhaustedAt: now, 
          resetAt, 
          exhaustCount: (account.exhaustCount || 0) + 1, 
          usageCount: (account.usageCount || 0) + 1,
          lastUsedAt: now,
          health: Math.max(0, account.health - 20)
        };

        // Update local state immediately for better UX
        const newAccounts = get().accounts.map(acc => 
          acc.id === id ? { ...acc, ...updates } : acc
        );
        const newEvent = { timestamp: now, accountId: id, service: account.service };
        
        set({ 
          accounts: newAccounts,
          usageHistory: [newEvent, ...get().usageHistory]
        });

        await dbService.updateAccount(id, updates);
        get().showToast(`${account.name} marked as exhausted`);
      },

      markExhaustedShared: async (email) => {
        const { accounts } = get();
        const linkedAccounts = accounts.filter(a => a.email && a.email.toLowerCase() === email.toLowerCase());
        if (linkedAccounts.length === 0) return;

        const now = Date.now();
        const newEvents = linkedAccounts.map(account => ({ timestamp: now, accountId: account.id, service: account.service }));
        
        const updatedAccounts = accounts.map(acc => {
          if (acc.email && acc.email.toLowerCase() === email.toLowerCase()) {
            const refreshTime = acc.lastRefreshedAt + (acc.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;
            const resetAt = refreshTime > now ? refreshTime : now + (acc.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;
            return {
              ...acc,
              exhaustedAt: now,
              resetAt,
              exhaustCount: (acc.exhaustCount || 0) + 1,
              usageCount: (acc.usageCount || 0) + 1,
              lastUsedAt: now,
              health: Math.max(0, acc.health - 20)
            };
          }
          return acc;
        });

        set({ 
          accounts: updatedAccounts,
          usageHistory: [...newEvents, ...get().usageHistory]
        });

        for (const account of linkedAccounts) {
          const updatedAcc = updatedAccounts.find(a => a.id === account.id);
          if (updatedAcc) {
            await dbService.updateAccount(account.id, { 
              exhaustedAt: updatedAcc.exhaustedAt, 
              resetAt: updatedAcc.resetAt, 
              exhaustCount: updatedAcc.exhaustCount, 
              usageCount: updatedAcc.usageCount,
              lastUsedAt: updatedAcc.lastUsedAt,
              health: updatedAcc.health
            });
          }
        }
        
        get().showToast(`${linkedAccounts.length} linked accounts marked as exhausted`);
      },

      resetAccount: async (id) => {
        const updates = { resetAt: null, exhaustedAt: null };
        
        set({
          accounts: get().accounts.map(acc => 
            acc.id === id ? { ...acc, ...updates } : acc
          )
        });

        await dbService.updateAccount(id, updates);
      },

      markRefreshed: async (id) => {
        const now = Date.now();
        const updates = { lastRefreshedAt: now, health: 100, resetAt: null, exhaustedAt: null };
        
        set({
          accounts: get().accounts.map(acc => 
            acc.id === id ? { ...acc, ...updates } : acc
          )
        });

        await dbService.updateAccount(id, updates);
        get().showToast(`Quota Restored: ${id.substring(0, 8)}...`);
      },

      setRefreshCycle: async (id, days) => {
        const updates = { refreshCycleDays: days };
        set({
          accounts: get().accounts.map(acc => 
            acc.id === id ? { ...acc, ...updates } : acc
          )
        });
        await dbService.updateAccount(id, updates);
      },

      addAccount: async (name, service, tier, priority, tags, refreshCycleDays = 1, notes = '', maxDailyUses = 0, email = '') => {
        const { user } = get();
        const now = Date.now();
        const newAccount: Omit<Account, 'id'> = {
          name,
          service,
          tier,
          color: COLORS[get().accounts.length % COLORS.length],
          resetAt: null,
          exhaustedAt: null,
          exhaustCount: 0,
          priority: priority,
          lastUsedAt: null,
          tags: tags,
          health: 100,
          stability: 'stable',
          refreshCycleDays,
          lastRefreshedAt: now,
          notes,
          usageCount: 0,
          maxDailyUses,
          createdAt: now,
          email,
        };

        if (isFirebaseConfigured && user) {
          // In Firebase mode, we let the real-time listener (onSnapshot) sync the new account
          await dbService.addAccount(newAccount, user.uid);
        } else {
          // Local mode: Add to Zustand state directly
          const localAccount: Account = {
            ...newAccount,
            id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
          };
          set({ accounts: [...get().accounts, localAccount] });
        }
        get().showToast(`${name} added successfully`);
      },

      updateAccountNotes: async (id, notes) => {
        set({
          accounts: get().accounts.map(acc => 
            acc.id === id ? { ...acc, notes } : acc
          )
        });
        await dbService.updateAccount(id, { notes });
      },

      incrementUsage: (id) => {
        set({
          accounts: get().accounts.map(acc => 
            acc.id === id ? { ...acc, usageCount: (acc.usageCount || 0) + 1, lastUsedAt: Date.now() } : acc
          )
        });
      },

      duplicateAccount: async (id) => {
        const account = get().accounts.find(a => a.id === id);
        if (!account) return;
        await get().addAccount(
          `${account.name}-copy`,
          account.service,
          account.tier,
          account.priority,
          account.tags,
          account.refreshCycleDays,
          account.notes,
          account.maxDailyUses,
          account.email
        );
        get().showToast(`${account.name} duplicated`);
      },

      deleteAccount: async (id) => {
        set({ accounts: get().accounts.filter(acc => acc.id !== id) });
        await dbService.deleteAccount(id);
        get().showToast(`Account purged from database`);
      },

      showToast: (msg) => set({ toast: msg }),
      clearToast: () => set({ toast: null }),
      setActiveView: (view) => set({ activeView: view }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),

      bulkReset: async () => {
        const updates = { resetAt: null, exhaustedAt: null };
        const newAccounts = get().accounts.map(acc => ({ ...acc, ...updates }));
        
        set({ accounts: newAccounts });

        const { accounts } = get();
        await dbService.bulkUpdate(accounts, updates);
        get().showToast('All accounts reset');
      },

      clearHistory: () => {
        set({ usageHistory: [] });
        get().showToast('Audit logs cleared');
      },

      getBestAccount: () => {
        const { accounts, selectedTag, selectedService, selectedStatus } = get();
        let filtered = accounts;
        
        if (selectedTag !== 'all') {
          filtered = filtered.filter(a => a.tags.includes(selectedTag));
        }
        if (selectedService !== 'all') {
          filtered = filtered.filter(a => a.service === selectedService);
        }
        if (selectedStatus !== 'all') {
          if (selectedStatus === 'active') filtered = filtered.filter(a => a.resetAt === null);
          if (selectedStatus === 'cooldown') filtered = filtered.filter(a => a.resetAt !== null);
        }

        const available = filtered.filter(a => a.resetAt === null);

        if (available.length === 0) return null;
        
        return available.sort((a, b) => {
          if (b.priority !== a.priority) return b.priority - a.priority;
          if (b.health !== a.health) return b.health - a.health;
          if (a.tier === 'pro' && b.tier === 'free') return -1;
          if (a.tier === 'free' && b.tier === 'pro') return 1;
          return 0;
        })[0];
      },

      toggleSelectAccount: (id) => {
        const { selectedAccounts } = get();
        if (selectedAccounts.includes(id)) {
          set({ selectedAccounts: selectedAccounts.filter(a => a !== id) });
        } else {
          set({ selectedAccounts: [...selectedAccounts, id] });
        }
      },

      selectAllAccounts: () => {
        const { accounts } = get();
        set({ selectedAccounts: accounts.map(a => a.id) });
      },

      deselectAllAccounts: () => {
        set({ selectedAccounts: [] });
      },

      bulkDeleteAccounts: async () => {
        const { selectedAccounts, accounts } = get();
        if (selectedAccounts.length === 0) return;
        
        const newAccounts = accounts.filter(a => !selectedAccounts.includes(a.id));
        set({ accounts: newAccounts, selectedAccounts: [] });
        
        for (const id of selectedAccounts) {
          await dbService.deleteAccount(id);
        }
        get().showToast(`${selectedAccounts.length} accounts deleted`);
      },

      bulkMarkExhausted: async () => {
        const { selectedAccounts, accounts } = get();
        if (selectedAccounts.length === 0) return;
        
        const now = Date.now();
        const newEvents = selectedAccounts.map(id => {
          const account = accounts.find(a => a.id === id);
          return account ? { timestamp: now, accountId: id, service: account.service } : null;
        }).filter(Boolean) as UsageEvent[];

        const updatedAccounts = accounts.map(acc => {
          if (!selectedAccounts.includes(acc.id)) return acc;
          return {
            ...acc,
            exhaustedAt: now,
            resetAt: now + 24 * 60 * 60 * 1000,
            exhaustCount: (acc.exhaustCount || 0) + 1,
            lastUsedAt: now,
            health: Math.max(0, acc.health - 20)
          };
        });

        set({ accounts: updatedAccounts, usageHistory: [...newEvents, ...get().usageHistory], selectedAccounts: [] });

        for (const id of selectedAccounts) {
          const updatedAcc = updatedAccounts.find(a => a.id === id);
          if (updatedAcc) {
            await dbService.updateAccount(id, { 
              exhaustedAt: updatedAcc.exhaustedAt, 
              resetAt: updatedAcc.resetAt,
              exhaustCount: updatedAcc.exhaustCount,
              lastUsedAt: updatedAcc.lastUsedAt,
              health: updatedAcc.health
            });
          }
        }
        get().showToast(`${selectedAccounts.length} accounts marked as exhausted`);
      },

      bulkResetAccounts: async () => {
        const { selectedAccounts, accounts } = get();
        if (selectedAccounts.length === 0) return;
        
        const updates = { resetAt: null, exhaustedAt: null };
        const updatedAccounts = accounts.map(acc => 
          selectedAccounts.includes(acc.id) ? { ...acc, ...updates } : acc
        );
        
        set({ accounts: updatedAccounts, selectedAccounts: [] });

        const accountsToUpdate = accounts.filter(a => selectedAccounts.includes(a.id));
        await dbService.bulkUpdate(accountsToUpdate, updates);
        get().showToast(`${selectedAccounts.length} accounts reset`);
      },

      exportAccounts: () => {
        const { accounts, usageHistory } = get();
        return JSON.stringify({ accounts, usageHistory, exportedAt: Date.now() }, null, 2);
      },

      importAccounts: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.accounts && Array.isArray(data.accounts)) {
            set({ 
              accounts: data.accounts, 
              usageHistory: data.usageHistory || [],
              selectedAccounts: []
            });
            
            for (const account of data.accounts) {
              dbService.addAccount(account, get().user?.uid || 'local-user');
            }
            get().showToast(`${data.accounts.length} accounts imported`);
            return true;
          }
          return false;
        } catch {
          get().showToast('Invalid import file');
          return false;
        }
      }
    }),
    {
      name: 'aim_v5_ultimate',
    }
  )
);