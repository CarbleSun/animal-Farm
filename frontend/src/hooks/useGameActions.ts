import { useUserStore } from '../store/useUserStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useAnimalStore } from '../store/useAnimalStore';

export interface ActionFeedback {
  type: 'feed' | 'play';
  stats: { hunger?: number; happiness?: number; affection?: number; };
}

export const useGameActions = () => {
  const spendPoints = useUserStore((state) => state.spendPoints);
  const inventory = useInventoryStore(); 
  const { updateStats, updateAffection, animals, activeAnimalId } = useAnimalStore();

  const activeAnimal = animals.find((a) => a.id === activeAnimalId);

  const buyItem = (type: 'food' | 'toy', price: number, amount: number) => {
    if (spendPoints(price)) {
      inventory.addItem(type, amount);
      return true;
    }
    return false;
  };

  const feedAnimal = (): ActionFeedback | null => {
    if (!activeAnimal || inventory.food <= 0) return null;
    if (inventory.useItem('food')) {
      const stats = { hunger: 30, happiness: 0, affection: 3 }; 
      updateStats(stats.hunger, stats.happiness); 
      updateAffection(stats.affection);
      return { type: 'feed', stats };
    }
    return null;
  };

  const playWithAnimal = (): ActionFeedback | null => {
    if (!activeAnimal || inventory.toy <= 0 || activeAnimal.isSick) return null; 
    if (inventory.useItem('toy')) {
      const stats = { hunger: -5, happiness: 30, affection: 5 }; 
      updateStats(stats.hunger, stats.happiness);
      updateAffection(stats.affection);
      return { type: 'play', stats };
    }
    return null;
  };

  return { buyItem, feedAnimal, playWithAnimal };
};