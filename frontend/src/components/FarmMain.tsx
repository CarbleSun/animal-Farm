import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useAnimalStore } from '../store/useAnimalStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useGameActions } from '../hooks/useGameActions';
import AdoptAnimal from './AdoptAnimal';
import ShopModal from './ShopModal';
import MiniGameModal from './MiniGameModal';

const FarmMain = () => {
  const { farmName, userName, points } = useUserStore();
  const { myAnimal, decreaseStats, decayOfflineStats } = useAnimalStore();
  const inventory = useInventoryStore();
  const { feedAnimal, playWithAnimal, cureAnimal } = useGameActions();
  
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  useEffect(() => {
    if (!myAnimal) return;
    decayOfflineStats(); 
    const timer = setInterval(() => { decreaseStats(); }, 60000);
    return () => clearInterval(timer);
  }, [myAnimal, decreaseStats, decayOfflineStats]);

  if (!myAnimal) return <AdoptAnimal />;

  const getAnimalEmoji = (species: string, level: number) => {
    if (species === 'Dog') return level >= 3 ? '🐺' : level >= 2 ? '🐕' : '🐶';
    if (species === 'Cat') return level >= 3 ? '🐅' : level >= 2 ? '🐈' : '🐱';
    if (species === 'Chick') return level >= 3 ? '🐔' : level >= 2 ? '🐥' : '🐣';
    return '❓';
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-sky-300">
      
      {isShopOpen && <ShopModal onClose={() => setIsShopOpen(false)} />}
      {isGameOpen && <MiniGameModal onClose={() => setIsGameOpen(false)} />}

      {/* --- 질병 시 화면 필터 --- */}
      {myAnimal.isSick && (
        <div className="absolute inset-0 bg-purple-900/30 z-0 animate-pulse pointer-events-none mix-blend-multiply"></div>
      )}

      {/* --- 1. 배경 레이어 --- */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className={`flex-[5] ${myAnimal.isSick ? 'bg-sky-500' : 'bg-sky-300'} relative transition-colors duration-1000`}>
          <div className="absolute top-10 left-[20%] text-6xl opacity-80">☁️</div>
          <div className="absolute top-12 left-[40%] w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-[0_0_20px_#fde047]"></div>
        </div>
        <div className={`flex-[3] ${myAnimal.isSick ? 'bg-green-600' : 'bg-green-400'} border-t-8 border-green-700 relative transition-colors duration-1000`}>
           <div className="absolute top-4 left-10 text-3xl opacity-60">🌿</div>
           <div className="absolute top-8 right-16 text-3xl opacity-60">🌼</div>
        </div>
      </div>

      {/* --- 2. 컨텐츠 레이어 --- */}
      <div className="relative z-10 flex flex-col h-full p-4 md:p-6">
        
        {/* 상단 정보 바 */}
        <div className="flex justify-between items-start w-full">
          <div className="bg-white px-4 py-2 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              {farmName} <span className="text-sm text-gray-500">({userName})</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsGameOpen(true)} className="bg-green-500 px-4 py-2 rounded-xl border-4 border-green-800 shadow-[4px_4px_0_#166534] text-white font-extrabold hover:bg-green-400 active:translate-y-[4px] active:shadow-none transition-all">👨‍🌾 알바</button>
            <button onClick={() => setIsShopOpen(true)} className="bg-blue-400 px-4 py-2 rounded-xl border-4 border-blue-800 shadow-[4px_4px_0_#1e3a8a] text-white font-extrabold hover:bg-blue-300 active:translate-y-[4px] active:shadow-none transition-all">🏪 상점</button>
            <div className="bg-yellow-300 px-4 py-2 rounded-xl border-4 border-yellow-700 shadow-[4px_4px_0_#854d0e] hidden md:block">
              <span className="text-lg font-extrabold text-yellow-900">💰 {points.toLocaleString()} P</span>
            </div>
          </div>
        </div>

        {/* 중앙 동물 캐릭터 (질병 시 애니메이션 및 이모지 변경) */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {myAnimal.isSick && (
            <div className="absolute -top-10 text-5xl animate-bounce">🤒</div>
          )}
          <div className={`text-[10rem] md:text-[12rem] drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] transition-transform duration-300 
            ${myAnimal.isSick ? 'opacity-70 rotate-6' : myAnimal.hunger < 30 ? 'animate-bounce' : 'hover:-translate-y-4 cursor-pointer'}`}>
            {getAnimalEmoji(myAnimal.species, myAnimal.level || 1)}
          </div>
        </div>

        {/* --- 하단 대시보드 --- */}
        <div className="bg-white/95 backdrop-blur p-5 md:p-6 rounded-3xl border-4 border-gray-800 shadow-[0_10px_0_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-stretch w-full gap-0 relative overflow-hidden">
          
          {/* 아플 때 나타나는 경고 띠 */}
          {myAnimal.isSick && <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse"></div>}

          {/* [왼쪽 구역]: 1/5 비율 */}
          <div className="w-full md:w-1/5 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-gray-200 pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="bg-yellow-400 text-yellow-900 font-extrabold px-2 py-1.5 rounded-xl border-2 border-gray-800 shadow-sm text-sm whitespace-nowrap">Lv.{myAnimal.level || 1}</span>
              <span className={`text-xl lg:text-2xl font-extrabold mt-1 truncate ${myAnimal.isSick ? 'text-red-600' : 'text-gray-800'}`}>
                {myAnimal.name}
              </span>
            </div>
            <div className="w-full mt-auto">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 tracking-wider">
                <span>EXP</span><span>{myAnimal.exp || 0} / {(myAnimal.level || 1) * 100}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3.5 border-2 border-gray-800 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((myAnimal.exp || 0) / ((myAnimal.level || 1) * 100)) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* [중앙 구역]: 2/5 비율 */}
          <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4 border-b-4 md:border-b-0 md:border-r-4 border-gray-200 py-4 md:py-0 md:px-6">
            <div>
              <div className="flex justify-between text-base font-bold mb-1.5 text-gray-800">
                <span>🍖 포만감</span><span className={myAnimal.hunger < 30 ? 'text-red-500' : ''}>{myAnimal.hunger} / 100</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4.5 border-2 border-gray-800 overflow-hidden">
                <div className={`h-full transition-all duration-500 ${myAnimal.hunger < 30 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${myAnimal.hunger}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-base font-bold mb-1.5 text-gray-800">
                <span>❤️ 행복도</span><span className={myAnimal.happiness < 30 ? 'text-red-500' : ''}>{myAnimal.happiness} / 100</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4.5 border-2 border-gray-800 overflow-hidden">
                <div className="bg-pink-400 h-full transition-all duration-500" style={{ width: `${myAnimal.happiness}%` }}></div>
              </div>
            </div>
          </div>

          {/* [오른쪽 구역]: 2/5 비율 (액션 버튼 3개 배치) */}
          <div className="w-full md:w-2/5 flex gap-2 lg:gap-4 justify-center md:justify-end items-center pt-4 md:pt-0 md:pl-6">
            <button onClick={feedAnimal} disabled={myAnimal.hunger >= 100 || inventory.food <= 0} className="relative group flex flex-col items-center justify-center bg-orange-400 hover:bg-orange-300 text-white w-16 h-16 lg:w-24 lg:h-24 rounded-2xl shadow-[0_4px_0_#9a3412] lg:shadow-[0_6px_0_#9a3412] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all border-4 border-orange-900 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.food}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">🍖</span>
              <span className="text-xs lg:text-lg font-extrabold text-orange-900">밥주기</span>
            </button>
            
            <button onClick={playWithAnimal} disabled={myAnimal.happiness >= 100 || inventory.toy <= 0 || myAnimal.isSick} className="relative group flex flex-col items-center justify-center bg-pink-400 hover:bg-pink-300 text-white w-16 h-16 lg:w-24 lg:h-24 rounded-2xl shadow-[0_4px_0_#831843] lg:shadow-[0_6px_0_#831843] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all border-4 border-pink-900 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.toy}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">🎾</span>
              <span className="text-xs lg:text-lg font-extrabold text-pink-900">놀아주기</span>
            </button>

            {/* 치료 버튼 추가 */}
            <button onClick={cureAnimal} disabled={!myAnimal.isSick || inventory.medicine <= 0} className={`relative group flex flex-col items-center justify-center w-16 h-16 lg:w-24 lg:h-24 rounded-2xl transition-all border-4 disabled:opacity-50 disabled:cursor-not-allowed ${myAnimal.isSick && inventory.medicine > 0 ? 'bg-red-500 hover:bg-red-400 border-red-900 shadow-[0_4px_0_#7f1d1d] lg:shadow-[0_6px_0_#7f1d1d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] animate-pulse' : 'bg-gray-300 border-gray-600 shadow-[0_4px_0_#4b5563] lg:shadow-[0_6px_0_#4b5563]'}`}>
              <span className="absolute -top-3 -right-3 bg-red-700 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.medicine}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">💊</span>
              <span className={`text-xs lg:text-lg font-extrabold ${myAnimal.isSick ? 'text-white' : 'text-gray-600'}`}>치료</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FarmMain;