import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'default' | 'night' | 'beach' | 'sunset';

export const getRankInfo = (graduatedCount: number) => {
  if (graduatedCount >= 60) return { title: '👑 공작', maxCapacity: 12 };
  if (graduatedCount >= 30) return { title: '👑 후작', maxCapacity: 10 };
  if (graduatedCount >= 15) return { title: '👑 백작', maxCapacity: 8 };
  if (graduatedCount >= 7) return { title: '👑 자작', maxCapacity: 6 };
  if (graduatedCount >= 3) return { title: '👑 남작', maxCapacity: 5 };
  if (graduatedCount >= 1) return { title: '👑 기사', maxCapacity: 4 };
  return { title: '🧑‍🌾 평민', maxCapacity: 3 };
};

interface UserState {
  farmName: string;
  userName: string;
  points: number;
  isFarmCreated: boolean;
  currentTheme: ThemeType;
  ownedThemes: ThemeType[];
  graduatedCount: number;
  
  createFarm: (farmName: string, userName: string) => void;
  spendPoints: (amount: number) => boolean;
  addPoints: (amount: number) => void;
  buyTheme: (theme: ThemeType, price: number) => boolean;
  setTheme: (theme: ThemeType) => void;
  addGraduatedCount: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      farmName: '',
      userName: '',
      points: 1000,
      isFarmCreated: false,
      currentTheme: 'default',
      ownedThemes: ['default'],
      graduatedCount: 0,

      createFarm: (farmName, userName) => set({ farmName, userName, isFarmCreated: true }),
      
      spendPoints: (amount) => {
        const currentPoints = get().points;
        if (currentPoints >= amount) {
          set({ points: currentPoints - amount });
          return true;
        }
        return false;
      },
      
      addPoints: (amount) => set((state) => ({ points: state.points + amount })),

      buyTheme: (theme, price) => {
        const { ownedThemes, spendPoints } = get();
        if (ownedThemes.includes(theme)) return false;
        if (spendPoints(price)) {
          set({ ownedThemes: [...ownedThemes, theme] });
          return true;
        }
        return false;
      },

      setTheme: (theme) => {
        if (get().ownedThemes.includes(theme)) {
          set({ currentTheme: theme });
        }
      },
      
      addGraduatedCount: () => set((state) => ({ graduatedCount: state.graduatedCount + 1 })),
    }),
    { name: 'user-storage' }
  )
);