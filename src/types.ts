export type ServiceType = 'gemini' | 'chatgpt' | 'claude' | 'copilot' | 'other';
export type TierType = 'free' | 'pro';
export type NodeTag = 'coding' | 'creative' | 'logic' | 'image' | 'fast';

export interface Account {
  id: string;
  name: string;
  service: ServiceType;
  tier: TierType;
  color: string;
  resetAt: number | null;
  exhaustedAt: number | null;
  exhaustCount: number;
  priority: number;
  lastUsedAt: number | null;
  tags: NodeTag[];
  health: number; // 0-100
  stability: 'stable' | 'degraded' | 'offline';
  refreshCycleDays: number;
  lastRefreshedAt: number;
  // Advanced fields
  notes: string;
  usageCount: number;
  maxDailyUses: number; // 0 = unlimited
  createdAt: number;
  email: string; // linked email/account identifier
}

export interface UsageEvent {
  timestamp: number;
  accountId: string;
  service: ServiceType;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface AppState {
  accounts: Account[];
  usageHistory: UsageEvent[];
  toast: string | null;
  activeView: string;
  searchQuery: string;
  selectedTag: NodeTag | 'all';
  selectedService: ServiceType | 'all';
  selectedStatus: 'all' | 'active' | 'cooldown';
  selectedAccounts: string[];
  theme: 'light' | 'dark' | 'system';
  user: User | null;
  isAuthInitialized: boolean;
  apiKeys: {
    gemini: string;
    openai: string;
    anthropic: string;
  };
  
  setApiKey: (service: 'gemini' | 'openai' | 'anthropic', key: string) => void;
  setSelectedService: (service: ServiceType | 'all') => void;
  setSelectedStatus: (status: 'all' | 'active' | 'cooldown') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  
  initialize: () => void;
  checkAndReset: (accounts: Account[]) => void;
  markExhausted: (id: string) => Promise<void>;
  markExhaustedShared: (email: string) => Promise<void>;
  resetAccount: (id: string) => Promise<void>;
  markRefreshed: (id: string) => Promise<void>;
  setRefreshCycle: (id: string, days: number) => Promise<void>;
  addAccount: (name: string, service: ServiceType, tier: TierType, priority: number, tags: NodeTag[], refreshCycleDays?: number, notes?: string, maxDailyUses?: number, email?: string) => Promise<void>;
  updateAccountNotes: (id: string, notes: string) => Promise<void>;
  incrementUsage: (id: string) => void;
  duplicateAccount: (id: string) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
  clearToast: () => void;
  setActiveView: (view: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: NodeTag | 'all') => void;
  bulkReset: () => Promise<void>;
  clearHistory: () => void;
  getBestAccount: () => Account | null;
  
  toggleSelectAccount: (id: string) => void;
  selectAllAccounts: () => void;
  deselectAllAccounts: () => void;
  bulkDeleteAccounts: () => Promise<void>;
  bulkMarkExhausted: () => Promise<void>;
  bulkResetAccounts: () => Promise<void>;
  
  exportAccounts: () => string;
  importAccounts: (json: string) => boolean;
}
