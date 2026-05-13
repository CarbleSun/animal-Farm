import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Species = 'Dog' | 'Cat' | 'Chick';

export interface Animal {
  id: string;
  name: string;
  species: Species;
  hunger: number;
  happiness: number;
  affection: number; // 👈 레벨/EXP 대신 호감도 사용
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
  updateAffection: (amount: number) => void; // 👈 호감도 증가 함수
  decayOfflineStats: () => void;
  cureDisease: () => void;
  graduateAnimal: (id: string) => void;
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
          affection: 0, // 초기 호감도 0%
          lastUpdated: Date.now(),
          isSick: false,
        };
        return {
          animals: [...state.animals, newAnimal],
          activeAnimalId: newAnimal.id,
        };
      }),

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

      // 👇 호감도 업데이트 (최대 100)
      updateAffection: (amount) => set((state) => ({
        animals: state.animals.map((animal) => {
          if (animal.id !== state.activeAnimalId) return animal;
          return { ...animal, affection: Math.min(100, (animal.affection || 0) + amount), lastUpdated: Date.now() };
        })
      })),

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

      cureDisease: () => set((state) => ({
        animals: state.animals.map((animal) =>
          animal.id === state.activeAnimalId ? { ...animal, isSick: false, lastUpdated: Date.now() } : animal
        )
      })),

      graduateAnimal: (id) => set((state) => {
        const remaining = state.animals.filter(a => a.id !== id);
        return {
          animals: remaining,
          activeAnimalId: state.activeAnimalId === id ? (remaining[0]?.id || null) : state.activeAnimalId
        };
      }),
    }),
    { name: 'animal-storage' }
  )
);