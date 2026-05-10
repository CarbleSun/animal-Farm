import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  isFarmCreated: boolean;
  farmName: string;
  userName: string;
  points: number;
  createFarm: (farmName: string, userName: string) => void;
  spendPoints: (amount: number) => boolean; // 구매 시 포인트 차감
	addPoints: (amount: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      farmName: '',
      userName: '',
      points: 1000,
			isFarmCreated: false,
      createFarm: (farmName, userName) => set({ farmName, userName, isFarmCreated: true }),
      spendPoints: (amount) => {
				const currentPoints = get().points;
        if (currentPoints >= amount) {
          set({ points: currentPoints - amount });
          return true; // 차감 성공
        }
        return false; // 포인트 부족
      },
			addPoints: (amount) => set((state) => ({ points: state.points + amount })),
    }),
    { name: 'user-storage' }
  )
);