import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './useUserStore';

export type AccountTier = 'beginner' | 'intermediate' | 'advanced' | 'vip';

export interface Transaction {
  id: string;
  date: string;
  type: '입금' | '출금' | '이자';
  amount: number;
  balance: number;
}

// 중급용(1,000 P) 및 고급용(20,000 P) 가입 조건(reqMin) 추가
export const ACCOUNT_INFO = {
  beginner: { name: '초보용', max: 1000, interest: 100, reqMin: 0 },
  intermediate: { name: '중급용', max: 20000, interest: 150, reqMin: 1000 },
  advanced: { name: '고급용', max: 1000000, interest: 200, reqMin: 20000 },
  vip: { name: 'V.I.P', max: 2100000000, interest: 400, reqMin: 1000000 },
};

interface BankState {
  bankBalance: number;
  accountTier: AccountTier;
  transactions: Transaction[];
  lastInterestDate: string;
  
  deposit: (amount: number) => boolean;
  withdraw: (amount: number) => boolean;
  changeAccountTier: (tier: AccountTier) => boolean;
  applyDailyInterest: () => void;
}

export const useBankStore = create<BankState>()(
  persist(
    (set, get) => ({
      bankBalance: 0,
      accountTier: 'beginner',
      transactions: [],
      lastInterestDate: '',

      deposit: (amount) => {
        const { bankBalance, accountTier, transactions } = get();
        const { points, spendPoints } = useUserStore.getState();
        const maxLimit = ACCOUNT_INFO[accountTier].max;
        
        if (amount <= 0 || points < amount) return false;
        if (bankBalance + amount > maxLimit) return false;

        if (spendPoints(amount)) {
          const newBalance = bankBalance + amount;
          const newTx: Transaction = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            type: '입금', amount, balance: newBalance
          };

          set({
            bankBalance: newBalance,
            transactions: [newTx, ...transactions].slice(0, 10) 
          });
          return true;
        }
        return false;
      },

      withdraw: (amount) => {
        const { bankBalance, transactions } = get();
        const { addPoints } = useUserStore.getState();
        
        if (amount <= 0 || bankBalance < amount) return false;

        const newBalance = bankBalance - amount;
        const newTx: Transaction = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: '출금', amount, balance: newBalance
        };

        addPoints(amount);
        set({
          bankBalance: newBalance,
          transactions: [newTx, ...transactions].slice(0, 10)
        });
        return true;
      },

      changeAccountTier: (tier) => {
        const { bankBalance } = get();
        const reqMin = ACCOUNT_INFO[tier].reqMin;
        if (bankBalance < reqMin) return false;
        set({ accountTier: tier });
        return true;
      },

      applyDailyInterest: () => {
        const { bankBalance, accountTier, lastInterestDate, transactions } = get();
        const today = new Date().toISOString().split('T')[0];

        if (lastInterestDate !== today) {
          const interest = ACCOUNT_INFO[accountTier].interest;
          const maxLimit = ACCOUNT_INFO[accountTier].max;
          
          let actualInterest = interest;
          if (bankBalance + interest > maxLimit) {
            actualInterest = maxLimit - bankBalance;
          }

          if (actualInterest > 0) {
            const newBalance = bankBalance + actualInterest;
            const newTx: Transaction = {
              id: Date.now().toString(),
              date: today, type: '이자', amount: actualInterest, balance: newBalance
            };

            set({
              bankBalance: newBalance,
              lastInterestDate: today,
              transactions: [newTx, ...transactions].slice(0, 10)
            });
          } else {
            set({ lastInterestDate: today });
          }
        }
      }
    }),
    { name: 'bank-storage' }
  )
);