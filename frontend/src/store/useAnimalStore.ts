import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Species = 'Dog' | 'Cat' | 'Chick';

export interface Animal {
  id: string;
  name: string;
  species: Species;
  hunger: number;
  happiness: number;
  lastUpdated: number;
}

interface AnimalState {
  myAnimal: Animal | null;
  adoptAnimal: (name: string, species: Species) => void;
  updateStats: (hungerDelta: number, happinessDelta: number) => void;
  decreaseStats: () => void;
}

export const useAnimalStore = create<AnimalState>()(
  persist(
    (set) => ({
      myAnimal: null,
      adoptAnimal: (name, species) => 
        set({
          myAnimal: {
            id: Date.now().toString(), name, species,
            hunger: 100, happiness: 100, lastUpdated: Date.now(),
          }
        }),
      updateStats: (hungerDelta, happinessDelta) => set((state) => {
        if (!state.myAnimal) return state;
        return {
          myAnimal: {
            ...state.myAnimal,
            hunger: Math.max(0, Math.min(100, state.myAnimal.hunger + hungerDelta)),
            happiness: Math.max(0, Math.min(100, state.myAnimal.happiness + happinessDelta)),
          }
        };
      }),
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
    { name: 'animal-storage' }
  )
);