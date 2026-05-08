import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useAnimalStore } from '../store/useAnimalStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useGameActions } from '../hooks/useGameActions';
import AdoptAnimal from './AdoptAnimal';
import ShopModal from './ShopModal';

const FarmMain = () => {
  // 스토어들에서 필요한 것만 쏙쏙 뽑아오기
  const { farmName, userName, points } = useUserStore();
  const { myAnimal, decreaseStats } = useAnimalStore();
  const inventory = useInventoryStore();
  
  // 액션 함수 가져오기
  const { feedAnimal, playWithAnimal } = useGameActions();
  const [isShopOpen, setIsShopOpen] = useState(false); // 상점 열림/닫힘 상태

  useEffect(() => {
    if (!myAnimal) return;
    const timer = setInterval(() => { decreaseStats(); }, 5000);
    return () => clearInterval(timer);
  }, [myAnimal, decreaseStats]);

  if (!myAnimal) return <AdoptAnimal />;

  const getAnimalEmoji = (species: string) => {
    switch (species) {
      case 'Dog': return '🐶';
      case 'Cat': return '🐱';
      case 'Chick': return '🐥';
      default: return '❓';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-sky-300">
      
      {/* 상점 모달 렌더링 (isShopOpen이 true일 때만) */}
      {isShopOpen && <ShopModal onClose={() => setIsShopOpen(false)} />}

      {/* 1. 상단 정보 바 */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="bg-white px-5 py-2 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
          <h2 className="text-xl font-bold text-gray-800">
            {farmName} <span className="text-sm text-gray-500">({userName})</span>
          </h2>
        </div>
        <div className="flex gap-2">
          {/* 상점 열기 버튼 */}
          <button 
            onClick={() => setIsShopOpen(true)}
            className="bg-blue-400 px-5 py-2 rounded-2xl border-4 border-blue-800 shadow-[4px_4px_0_#1e3a8a] text-white font-extrabold hover:bg-blue-300 active:translate-y-1 active:shadow-none transition-all"
          >
            🏪 상점
          </button>
          <div className="bg-yellow-300 px-5 py-2 rounded-2xl border-4 border-yellow-700 shadow-[4px_4px_0_#854d0e]">
            <span className="text-xl font-extrabold text-yellow-900">💰 {points.toLocaleString()} P</span>
          </div>
        </div>
      </div>

      {/* 2. 배경 */}
      <div className="flex-3 relative">
        <div className="absolute top-12 left-1/4 text-6xl opacity-80">☁️</div>
        <div className="absolute top-8 right-1/4 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-[0_0_20px_#fde047]"></div>
      </div>
      <div className="flex-2 bg-green-400 border-t-8 border-green-600 relative">
         <div className="absolute top-4 left-10 text-3xl opacity-60">🌿</div>
         <div className="absolute top-8 right-16 text-3xl opacity-60">🌼</div>
      </div>

      {/* 3. 중앙 동물 캐릭터 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-10">
        <div className={`text-[10rem] drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 ${myAnimal.hunger < 30 ? 'animate-bounce' : ''}`}>
          {getAnimalEmoji(myAnimal.species)}
        </div>
        <div className="mt-2 bg-white px-6 py-2 rounded-full border-4 border-gray-800 shadow-md">
          <span className="text-2xl font-extrabold text-gray-800">{myAnimal.name}</span>
        </div>
      </div>

      {/* 4. 하단 상태 및 조작 패널 */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-5 rounded-3xl border-4 border-gray-800 shadow-[0_10px_0_rgba(0,0,0,0.2)] z-20 flex flex-col md:flex-row gap-6 items-center">
        
        {/* 상태 게이지 바 */}
        <div className="flex-1 w-full space-y-4 pr-0 md:pr-6 border-b-4 md:border-b-0 md:border-r-4 border-gray-200 pb-4 md:pb-0">
          <div>
            <div className="flex justify-between text-lg font-bold mb-1 text-gray-800">
              <span>🍖 포만감</span>
              <span className={myAnimal.hunger < 30 ? 'text-red-500' : ''}>{myAnimal.hunger} / 100</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-6 border-4 border-gray-800 overflow-hidden">
              <div className={`h-full transition-all duration-500 ${myAnimal.hunger < 30 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${myAnimal.hunger}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-lg font-bold mb-1 text-gray-800">
              <span>❤️ 행복도</span>
              <span>{myAnimal.happiness} / 100</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-6 border-4 border-gray-800 overflow-hidden">
              <div className="bg-pink-400 h-full transition-all duration-500" style={{ width: `${myAnimal.happiness}%` }}></div>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 (인벤토리 수량 표시 추가) */}
        <div className="flex gap-4 w-full md:w-auto justify-center">
          <button 
            onClick={feedAnimal}
            disabled={myAnimal.hunger >= 100 || inventory.food <= 0}
            className="relative group flex flex-col items-center justify-center bg-orange-400 hover:bg-orange-300 text-white w-24 h-24 rounded-2xl shadow-[0_6px_0_#9a3412] hover:translate-y-0.5 hover:shadow-[0_4px_0_#9a3412] active:shadow-none active:translate-y-1.5 transition-all border-4 border-orange-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* 남은 개수 표시 뱃지 */}
            <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm text-sm">
              {inventory.food}
            </span>
            <span className="text-3xl mb-1 group-active:scale-90">🍖</span>
            <span className="text-lg font-extrabold text-orange-900">밥주기</span>
          </button>
          
          <button 
            onClick={playWithAnimal}
            disabled={myAnimal.happiness >= 100 || inventory.toy <= 0}
            className="relative group flex flex-col items-center justify-center bg-pink-400 hover:bg-pink-300 text-white w-24 h-24 rounded-2xl shadow-[0_6px_0_#831843] hover:translate-y-0.5 hover:shadow-[0_4px_0_#831843] active:shadow-none active:translate-y-1.5 transition-all border-4 border-pink-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* 남은 개수 표시 뱃지 */}
            <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm text-sm">
              {inventory.toy}
            </span>
            <span className="text-3xl mb-1 group-active:scale-90">🎾</span>
            <span className="text-lg font-extrabold text-pink-900">놀아주기</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default FarmMain;