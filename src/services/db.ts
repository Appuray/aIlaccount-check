// ── FILE: src/services/db.ts ──────────────────────────────
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { Account } from '../types';

const ACCOUNTS_COLLECTION = 'accounts';

export const dbService = {
  // Subscribe to real-time updates for a specific user
  subscribeToAccounts: (userId: string, callback: (accounts: Account[]) => void) => {
    if (!isFirebaseConfigured) return () => {};
    const q = query(
      collection(db, ACCOUNTS_COLLECTION), 
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      const accounts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Account[];
      // Sort client-side to avoid needing a Firebase composite index
      const sortedAccounts = accounts.sort((a, b) => a.name.localeCompare(b.name));
      callback(sortedAccounts);
    });
  },

  // Add a new account with userId
  addAccount: async (account: Omit<Account, 'id'>, userId: string) => {
    if (!isFirebaseConfigured) return null;
    return await addDoc(collection(db, ACCOUNTS_COLLECTION), { ...account, userId });
  },

  // Update an account
  updateAccount: async (id: string, updates: Partial<Account>) => {
    if (!isFirebaseConfigured) return null;
    const accountRef = doc(db, ACCOUNTS_COLLECTION, id);
    return await updateDoc(accountRef, updates);
  },

  // Delete an account
  deleteAccount: async (id: string) => {
    if (!isFirebaseConfigured) return null;
    const accountRef = doc(db, ACCOUNTS_COLLECTION, id);
    return await deleteDoc(accountRef);
  },

  // Bulk update
  bulkUpdate: async (accounts: Account[], updates: Partial<Account>) => {
    if (!isFirebaseConfigured) return [];
    const promises = accounts.map(acc => {
      const accountRef = doc(db, ACCOUNTS_COLLECTION, acc.id);
      return updateDoc(accountRef, updates);
    });
    return await Promise.all(promises);
  }
};
