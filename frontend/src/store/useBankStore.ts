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

export const ACCOUNT_INFO = {
  beginner: { name: '초보용', max: 1000, interest: 100, reqMin: 0 },
  intermediate: { name: '중급용', max: 20000, interest: 150, reqMin: 1000 },
  advanced: { name: '고급용', max: 1000000, interest: 200, reqMin: 20000 },
  vip: { name: 'V.I.P', max: 2100000000, interest: 400, reqMin: 1000000 },
};

// 👇 잔고 액수에 맞춰 등급을 자동으로 결정하는 헬퍼 함수
const autoDetermineTier = (balance: number): AccountTier => {
  if (balance >= ACCOUNT_INFO.vip.reqMin) return 'vip';
  if (balance >= ACCOUNT_INFO.advanced.reqMin) return 'advanced';
  if (balance >= ACCOUNT_INFO.intermediate.reqMin) return 'intermediate';
  return 'beginner';
};

interface BankState {
  bankBalance: number;
  accountTier: AccountTier;
  transactions: Transaction[];
  lastInterestDate: string;
  
  deposit: (amount: number) => boolean;
  withdraw: (amount: number) => boolean;
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
        const { bankBalance, transactions } = get();
        const { points, spendPoints } = useUserStore.getState();
        
        if (amount <= 0 || points < amount) return false;
        
        // 입금 후의 예상 잔고를 바탕으로 도달하게 될 등급과 한도를 계산
        const expectedBalance = bankBalance + amount;
        const nextTier = autoDetermineTier(expectedBalance);
        const maxLimit = ACCOUNT_INFO[nextTier].max;
        
        // 승급될 한도를 초과하는지 검사
        if (expectedBalance > maxLimit) return false;

        if (spendPoints(amount)) {
          const newTx: Transaction = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            type: '입금', amount, balance: expectedBalance
          };

          set({
            bankBalance: expectedBalance,
            accountTier: nextTier, // 👈 자동 업그레이드 반영
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
        const nextTier = autoDetermineTier(newBalance); // 👈 출금 후 잔고에 맞게 자동 다운그레이드 반영
        
        const newTx: Transaction = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: '출금', amount, balance: newBalance
        };

        addPoints(amount);
        set({
          bankBalance: newBalance,
          accountTier: nextTier,
          transactions: [newTx, ...transactions].slice(0, 10)
        });
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
            const nextTier = autoDetermineTier(newBalance); // 👈 이자 누적 후 자동 등급 판정
            
            const newTx: Transaction = {
              id: Date.now().toString(),
              date: today, type: '이자', amount: actualInterest, balance: newBalance
            };

            set({
              bankBalance: newBalance,
              accountTier: nextTier,
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