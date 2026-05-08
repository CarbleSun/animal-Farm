import { useUserStore } from '../store/useUserStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useAnimalStore } from '../store/useAnimalStore';

export const useGameActions = () => {
  const spendPoints = useUserStore((state) => state.spendPoints);
  const { addItem, useItem } = useInventoryStore();
  const { updateStats, addExp, myAnimal, cureDisease } = useAnimalStore();

  const buyItem = (type: 'food' | 'toy' | 'medicine', price: number, amount: number) => {
    if (spendPoints(price)) {
      addItem(type, amount);
      return true;
    }
    return false;
  };

  const feedAnimal = () => {
    if (useItem('food')) {
      updateStats(30, 0); 
      addExp(20); 
    }
  };

  const playWithAnimal = () => {
    // 아플 때는 놀아줄 수 없음 (예외 처리)
    if (myAnimal?.isSick) return; 
    
    if (useItem('toy')) {
      updateStats(-5, 30);
      addExp(30); 
    }
  };

  // 👇 치료 로직 추가
  const cureAnimal = () => {
    if (!myAnimal?.isSick) return; // 아프지 않으면 무시
    if (useItem('medicine')) {
      cureDisease(); // 약 소모 시 병 완치
    }
  };

  return { buyItem, feedAnimal, playWithAnimal, cureAnimal };
};