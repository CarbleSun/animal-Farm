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
  isSick: boolean;
}

interface AnimalState {
  animals: Animal[];
  activeAnimalId: string | null;
  setActiveAnimal: (id: string) => void;
  adoptAnimal: (name: string, species: Species) => void;
  updateStats: (hungerDelta: number, happinessDelta: number) => void;
  decreaseStats: () => void;
  addExp: (amount: number) => void;
  decayOfflineStats: () => void;
  cureDisease: () => void;
}

export const useAnimalStore = create<AnimalState>()(
  persist(
    (set) => ({
      animals: [],
      activeAnimalId: null,
      
      setActiveAnimal: (id) => set({ activeAnimalId: id }),
      
      adoptAnimal: (name, species) => set((state) => {
        const newAnimal: Animal = {
          id: Date.now().toString(),
          name, species,
          hunger: 100, happiness: 100,
          level: 1, exp: 0,
          lastUpdated: Date.now(),
          isSick: false,
        };
        return {
          animals: [...state.animals, newAnimal],
          activeAnimalId: newAnimal.id, // 입양 시 해당 동물을 바로 활성화
        };
      }),

      // 현재 활성화된 동물에게만 적용
      updateStats: (hungerDelta, happinessDelta) => set((state) => ({
        animals: state.animals.map((animal) => {
          if (animal.id !== state.activeAnimalId) return animal;
          const newHunger = Math.max(0, Math.min(100, animal.hunger + hungerDelta));
          const newHappiness = Math.max(0, Math.min(100, animal.happiness + happinessDelta));
          return {
            ...animal,
            hunger: newHunger,
            happiness: newHappiness,
            isSick: animal.isSick || newHunger <= 20 || newHappiness <= 20,
            lastUpdated: Date.now(),
          };
        })
      })),

      // 보유한 모든 동물에게 적용 (배고픔 감소)
      decreaseStats: () => set((state) => ({
        animals: state.animals.map((animal) => {
          const hungerDrop = animal.isSick ? 4 : 2;
          const happinessDrop = animal.isSick ? 2 : 1;
          const newHunger = Math.max(0, animal.hunger - hungerDrop);
          const newHappiness = Math.max(0, animal.happiness - happinessDrop);
          return {
            ...animal,
            hunger: newHunger,
            happiness: newHappiness,
            isSick: animal.isSick || newHunger <= 20 || newHappiness <= 20,
            lastUpdated: Date.now(),
          };
        })
      })),

      // 현재 활성화된 동물에게만 적용
      addExp: (amount) => set((state) => ({
        animals: state.animals.map((animal) => {
          if (animal.id !== state.activeAnimalId) return animal;
          let newExp = (animal.exp || 0) + amount;
          let newLevel = animal.level || 1;
          while (newExp >= newLevel * 100) {
            newExp -= newLevel * 100;
            newLevel += 1;
          }
          return { ...animal, level: newLevel, exp: newExp, lastUpdated: Date.now() };
        })
      })),

      // 보유한 모든 동물에게 적용 (오프라인 수치 저하)
      decayOfflineStats: () => set((state) => {
        const now = Date.now();
        return {
          animals: state.animals.map((animal) => {
            const minutesPassed = Math.floor((now - animal.lastUpdated) / 60000);
            if (minutesPassed <= 0) return animal;

            const hungerDrop = animal.isSick ? minutesPassed * 4 : minutesPassed * 2;
            const happinessDrop = animal.isSick ? minutesPassed * 2 : minutesPassed * 1;
            const newHunger = Math.max(0, animal.hunger - hungerDrop);
            const newHappiness = Math.max(0, animal.happiness - happinessDrop);

            return {
              ...animal,
              hunger: newHunger,
              happiness: newHappiness,
              isSick: animal.isSick || newHunger <= 20 || newHappiness <= 20,
              lastUpdated: now,
            };
          })
        };
      }),

      // 현재 활성화된 동물 치료
      cureDisease: () => set((state) => ({
        animals: state.animals.map((animal) =>
          animal.id === state.activeAnimalId
            ? { ...animal, isSick: false, lastUpdated: Date.now() }
            : animal
        )
      })),
    }),
    { name: 'animal-storage' }
  )
);