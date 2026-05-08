import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  isFarmCreated: boolean;
  farmName: string;
  userName: string;
  points: number;
  createFarm: (farmName: string, userName: string) => void;
  spendPoints: (amount: number) => boolean; // 구매 시 포인트 차감
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isFarmCreated: false,
      farmName: '',
      userName: '',
      points: 1000,
      createFarm: (farmName, userName) => set({ farmName, userName, isFarmCreated: true }),
      spendPoints: (amount) => {
        if (get().points >= amount) {
          set({ points: get().points - amount });
          return true; // 차감 성공
        }
        return false; // 포인트 부족
      },
    }),
    { name: 'user-storage' }
  )
);