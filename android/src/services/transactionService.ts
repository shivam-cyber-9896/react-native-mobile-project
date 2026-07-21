/**
 * Transaction Service
 * Handles all transaction CRUD operations using AsyncStorage.
 * Each user has their own storage key for data isolation.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ──
export type TransactionType = 'expense' | 'income';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Bills'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  note: string;
  type: TransactionType;
  date: string; // ISO string
  userId: string;
  pdfUri?: string;
  pdfName?: string;
}

// Category emoji mapping
export const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Health: '💊',
  Bills: '📄',
  Salary: '💰',
  Freelance: '💻',
  Investment: '📈',
  Other: '📌',
};

export const EXPENSE_CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Bills',
  'Other',
];

export const INCOME_CATEGORIES: Category[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

// ── Storage Key (per-user isolation) ──
const storageKey = (userId: string) => `transactions_${userId}`;

// ── CRUD Operations ──

/**
 * Get all transactions for a user, sorted by date descending (newest first).
 */
export async function getTransactions(
  userId: string,
): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    if (!raw) {
      return [];
    }
    const data: Transaction[] = JSON.parse(raw);
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error('Error reading transactions:', error);
    return [];
  }
}

/**
 * Add a new transaction. ID and userId are generated here — caller doesn't provide them.
 */
export async function addTransaction(
  userId: string,
  data: Omit<Transaction, 'id' | 'userId'>,
): Promise<Transaction> {
  const existing = await getTransactions(userId);
  const newTx: Transaction = {
    ...data,
    id: Date.now().toString(),
    userId,
  };
  await AsyncStorage.setItem(
    storageKey(userId),
    JSON.stringify([...existing, newTx]),
  );
  return newTx;
}

/**
 * Delete a transaction by ID.
 */
export async function deleteTransaction(
  userId: string,
  transactionId: string,
): Promise<void> {
  const existing = await getTransactions(userId);
  const filtered = existing.filter(t => t.id !== transactionId);
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(filtered));
}

/**
 * Get profile photo URI from AsyncStorage.
 */
export async function getProfilePhoto(
  userId: string,
): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(`profile_photo_${userId}`);
  } catch {
    return null;
  }
}

/**
 * Save profile photo URI to AsyncStorage.
 */
export async function saveProfilePhoto(
  userId: string,
  uri: string,
): Promise<void> {
  await AsyncStorage.setItem(`profile_photo_${userId}`, uri);
}
