import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Species = 'Dog' | 'Cat' | 'Chick';

export interface Animal {
  id: string;
  name: string;
  species: Species;
  hunger: number;    // 포만감 (0~100)
  happiness: number; // 행복도 (0~100)
  lastUpdated: number; // 오프라인 계산을 위한 마지막 접속 시간
}

interface GameState {
  isFarmCreated: boolean;
  farmName: string;
  userName: string;
  points: number;
  myAnimal: Animal | null;
  
  createFarm: (farmName: string, userName: string) => void;
  adoptAnimal: (name: string, species: Species) => void;
  
  // 🐾 새롭게 추가된 액션들
  feedAnimal: () => void;
  playWithAnimal: () => void;
  decreaseStats: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      isFarmCreated: false,
      farmName: '',
      userName: '',
      points: 1000,
      myAnimal: null,
      
      createFarm: (farmName, userName) => 
        set({ farmName, userName, isFarmCreated: true }),
        
      adoptAnimal: (name, species) => 
        set({
          myAnimal: {
            id: Date.now().toString(),
            name,
            species,
            hunger: 100,
            happiness: 100,
            lastUpdated: Date.now(),
          }
        }),

      // 밥 주기: 포만감 20 증가 (최대 100)
      feedAnimal: () => set((state) => {
        if (!state.myAnimal) return state;
        return {
          myAnimal: {
            ...state.myAnimal,
            hunger: Math.min(100, state.myAnimal.hunger + 20),
          }
        };
      }),

      // 놀아주기: 행복도 20 증가, 대신 포만감 5 감소
      playWithAnimal: () => set((state) => {
        if (!state.myAnimal) return state;
        return {
          myAnimal: {
            ...state.myAnimal,
            happiness: Math.min(100, state.myAnimal.happiness + 20),
            hunger: Math.max(0, state.myAnimal.hunger - 5),
          }
        };
      }),

      // 시간 경과: 포만감과 행복도 감소 (최소 0)
      decreaseStats: () => set((state) => {
        if (!state.myAnimal) return state;
        return {
          myAnimal: {
            ...state.myAnimal,
            hunger: Math.max(0, state.myAnimal.hunger - 2),
            happiness: Math.max(0, state.myAnimal.happiness - 1),
          }
        };
      }),
    }),
    { name: 'animal-farm-storage' }
  )
);