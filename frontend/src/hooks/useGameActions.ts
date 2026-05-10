import { useUserStore } from '../store/useUserStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useAnimalStore } from '../store/useAnimalStore';

export interface ActionFeedback {
  type: 'feed' | 'play' | 'cure';
  stats: { hunger?: number; happiness?: number; exp: number; };
}

export const useGameActions = () => {
  const spendPoints = useUserStore((state) => state.spendPoints);
  const inventory = useInventoryStore(); 
  const { updateStats, addExp, animals, activeAnimalId, cureDisease } = useAnimalStore();

  const activeAnimal = animals.find((a) => a.id === activeAnimalId);

  const buyItem = (type: 'food' | 'toy' | 'medicine', price: number, amount: number) => {
    if (spendPoints(price)) {
      inventory.addItem(type, amount);
      return true;
    }
    return false;
  };

  const feedAnimal = (): ActionFeedback | null => {
    if (!activeAnimal || inventory.food <= 0) return null;
    if (inventory.useItem('food')) {
      const stats = { hunger: 30, happiness: 0, exp: 20 };
      updateStats(stats.hunger, stats.happiness); 
      addExp(stats.exp);
      return { type: 'feed', stats };
    }
    return null;
  };

  const playWithAnimal = (): ActionFeedback | null => {
    if (!activeAnimal || inventory.toy <= 0 || activeAnimal.isSick) return null; 
    if (inventory.useItem('toy')) {
      const stats = { hunger: -5, happiness: 30, exp: 30 };
      updateStats(stats.hunger, stats.happiness);
      addExp(stats.exp);
      return { type: 'play', stats };
    }
    return null;
  };

  const cureAnimal = (): ActionFeedback | null => {
    if (!activeAnimal?.isSick || inventory.medicine <= 0) return null;
    if (inventory.useItem('medicine')) {
      cureDisease();
      return { type: 'cure', stats: { exp: 50 } };
    }
    return null;
  };

  return { buyItem, feedAnimal, playWithAnimal, cureAnimal };
};