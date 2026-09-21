import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  phone: string;
  fullName: string;
  shopName: string;
  password?: string;
  storeScale?: string;
  businessType?: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  item: string;
  totalAmount: number;
  person?: string;
  date: string;
  userId?: string;
  quantity?: number;
  unit?: string;
  debtAmount?: number;
  method?: string;
}

export interface Debt {
  id: string;
  type: 'income' | 'expense';
  item: string;
  debtAmount: number;
  quantity?: number;
  person?: string;
  method?: string;
  date: string;
  isPaid?: boolean;
}

interface AppState {
  users: User[];
  currentUser: User | null;
  registerUser: (user: User) => { success: boolean; message: string };
  loginUser: (phone: string, pass: string) => { success: boolean; message: string };
  logoutUser: () => void;
  updateProfile: (data: Partial<User>) => void;
  
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;

  debts: Debt[];
  addDebt: (debt: Debt) => void;
  toggleDebtPaid: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      registerUser: (newUser) => {
        const { users } = get();
        if (users.find((u) => u.phone === newUser.phone)) {
          return { success: false, message: 'Số điện thoại đã được đăng ký.' };
        }
        const updatedUsers = [...users, newUser];
        set({ users: updatedUsers, currentUser: newUser });
        return { success: true, message: 'Đăng ký thành công.' };
      },

      loginUser: (phone, password) => {
        const { users } = get();
        const user = users.find((u) => u.phone === phone && u.password === password);
        if (user) {
          set({ currentUser: user });
          return { success: true, message: 'Đăng nhập thành công.' };
        }
        return { success: false, message: 'Sai số điện thoại hoặc mật khẩu.' };
      },

      logoutUser: () => set({ currentUser: null }),

      updateProfile: (updatedData) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updatedData };
        const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
        set({ currentUser: updatedUser, users: updatedUsers });
      },

      transactions: [],
      addTransaction: (tx) => {
        const state = get();
        const newTx = { 
          ...tx, 
          type: tx.type || 'income', 
          userId: state.currentUser?.id 
        };
        set({ transactions: [newTx, ...state.transactions] });
      },

      debts: [],
      addDebt: (debt) => {
        const state = get();
        const newDebt = { ...debt, isPaid: false };
        set({ debts: [newDebt, ...state.debts] });
      },

      toggleDebtPaid: (id) => {
        const state = get();
        const updatedDebts = state.debts.map((d) => 
          d.id === id ? { ...d, isPaid: !d.isPaid } : d
        );
        set({ debts: updatedDebts });
      },
    }),
    {
      name: 's-ledger-cloud-storage',
    }
  )
);