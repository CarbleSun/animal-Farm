import { useUserStore } from '../store/useUserStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useAnimalStore } from '../store/useAnimalStore';

export const useGameActions = () => {
  const spendPoints = useUserStore((state) => state.spendPoints);
  const { addItem, useItem } = useInventoryStore();
  const updateStats = useAnimalStore((state) => state.updateStats);

  // 상점 구매 로직
  const buyItem = (type: 'food' | 'toy', price: number, amount: number) => {
    if (spendPoints(price)) {
      addItem(type, amount);
      return true; // 구매 성공
    }
    return false; // 돈 부족
  };

  // 밥 주기 로직
  const feedAnimal = () => {
    if (useItem('food')) {
      updateStats(30, 0); // 밥 소모 성공 시 포만감 +30
    }
  };

  // 놀아주기 로직
  const playWithAnimal = () => {
    if (useItem('toy')) {
      updateStats(-5, 30); // 장난감 소모 성공 시 포만감 -5, 행복도 +30
    }
  };

  return { buyItem, feedAnimal, playWithAnimal };
};