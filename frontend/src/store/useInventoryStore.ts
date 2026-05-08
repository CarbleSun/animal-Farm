import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InventoryState {
  food: number;
  toy: number;
	medicine: number;
  addItem: (type: 'food' | 'toy' | 'medicine', amount: number) => void;
  useItem: (type: 'food' | 'toy' | 'medicine') => boolean;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      food: 5,
      toy: 3,
			medicine: 1,
      addItem: (type, amount) => set({ [type]: get()[type] + amount }),
      useItem: (type) => {
        if (get()[type] > 0) {
          set({ [type]: get()[type] - 1 });
          return true; // 사용 성공
        }
        return false; // 아이템 부족
      },
    }),
    { name: 'inventory-storage' }
  )
);