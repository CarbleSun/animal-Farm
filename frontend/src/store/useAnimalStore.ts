import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Species = 'Dog' | 'Cat' | 'Chick';

export interface Animal {
  id: string;
  name: string;
  species: Species;
  hunger: number;
  happiness: number;
  level: number;
  exp: number;
  lastUpdated: number;
  isSick: boolean; // 👈 질병 상태 추가
}

interface AnimalState {
  myAnimal: Animal | null;
  adoptAnimal: (name: string, species: Species) => void;
  updateStats: (hungerDelta: number, happinessDelta: number) => void;
  decreaseStats: () => void;
  addExp: (amount: number) => void;
  decayOfflineStats: () => void;
  cureDisease: () => void; // 👈 치료 함수 추가
}

export const useAnimalStore = create<AnimalState>()(
  persist(
    (set, get) => ({
      myAnimal: null,
      adoptAnimal: (name, species) => 
        set({
          myAnimal: {
            id: Date.now().toString(), name, species,
            hunger: 100, happiness: 100,
            level: 1, exp: 0,
            lastUpdated: Date.now(),
            isSick: false,
          }
        }),
      updateStats: (hungerDelta, happinessDelta) => set((state) => {
        if (!state.myAnimal) return state;
        const newHunger = Math.max(0, Math.min(100, state.myAnimal.hunger + hungerDelta));
        const newHappiness = Math.max(0, Math.min(100, state.myAnimal.happiness + happinessDelta));
        
        return {
          myAnimal: {
            ...state.myAnimal,
            hunger: newHunger,
            happiness: newHappiness,
            // 수치가 20 이하로 떨어지면 병에 걸림
            isSick: state.myAnimal.isSick || newHunger <= 20 || newHappiness <= 20,
            lastUpdated: Date.now(), 
          }
        };
      }),
      decreaseStats: () => set((state) => {
        if (!state.myAnimal) return state;
        // 병에 걸리면 감소량 2배 페널티
        const hungerDrop = state.myAnimal.isSick ? 4 : 2;
        const happinessDrop = state.myAnimal.isSick ? 2 : 1;
        
        const newHunger = Math.max(0, state.myAnimal.hunger - hungerDrop);
        const newHappiness = Math.max(0, state.myAnimal.happiness - happinessDrop);

        return {
          myAnimal: {
            ...state.myAnimal,
            hunger: newHunger,
            happiness: newHappiness,
            isSick: state.myAnimal.isSick || newHunger <= 20 || newHappiness <= 20,
            lastUpdated: Date.now(), 
          }
        };
      }),
      addExp: (amount) => set((state) => {
        if (!state.myAnimal) return state;
        let newExp = (state.myAnimal.exp || 0) + amount;
        let newLevel = state.myAnimal.level || 1;
        while (newExp >= newLevel * 100) {
          newExp -= newLevel * 100;
          newLevel += 1;
        }
        return {
          myAnimal: {
            ...state.myAnimal, level: newLevel, exp: newExp, lastUpdated: Date.now(),
          }
        };
      }),
      decayOfflineStats: () => {
        const animal = get().myAnimal;
        if (!animal) return;
        const now = Date.now();
        const minutesPassed = Math.floor((now - animal.lastUpdated) / 60000); 

        if (minutesPassed > 0) {
          // 오프라인 상태에서도 병에 걸려있었다면 2배 감소
          const hungerDrop = animal.isSick ? minutesPassed * 4 : minutesPassed * 2;
          const happinessDrop = animal.isSick ? minutesPassed * 2 : minutesPassed * 1;
          
          const newHunger = Math.max(0, animal.hunger - hungerDrop);
          const newHappiness = Math.max(0, animal.happiness - happinessDrop);

          set((state) => ({
            myAnimal: state.myAnimal ? {
              ...state.myAnimal,
              hunger: newHunger,
              happiness: newHappiness,
              isSick: animal.isSick || newHunger <= 20 || newHappiness <= 20,
              lastUpdated: now,
            } : null
          }));
        }
      },
      // 👇 치료 실행 시 질병 상태 해제
      cureDisease: () => set((state) => ({
        myAnimal: state.myAnimal ? { ...state.myAnimal, isSick: false, lastUpdated: Date.now() } : null
      }))
    }),
    { name: 'animal-storage' }
  )
);