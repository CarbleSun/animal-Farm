import { useEffect, useState, useRef } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useAnimalStore } from '../store/useAnimalStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useGameActions, type ActionFeedback } from '../hooks/useGameActions';
import AdoptAnimal from './AdoptAnimal';
import ShopModal from './ShopModal';
import MiniGameModal from './MiniGameModal';
import AnimalListModal from './AnimalListModal';

interface FeedbackText { id: number; text: string; x: number; y: number; color: string; }

const FarmMain = () => {
  const { farmName, userName, points } = useUserStore();
  const { animals, activeAnimalId, decreaseStats, decayOfflineStats } = useAnimalStore();
  const inventory = useInventoryStore();
  const { feedAnimal: baseFeed, playWithAnimal: basePlay, cureAnimal: baseCure } = useGameActions();
  
  const myAnimal = animals.find(a => a.id === activeAnimalId);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isAdoptMode, setIsAdoptMode] = useState(false);

  const [feedbackTexts, setFeedbackTexts] = useState<FeedbackText[]>([]);
  const [showLevelUpEffect, setShowLevelUpEffect] = useState(false);
  const prevLevelRef = useRef(myAnimal?.level || 1);

  useEffect(() => {
    if (animals.length === 0) return;
    decayOfflineStats(); 
    const timer = setInterval(() => { decreaseStats(); }, 60000);
    return () => clearInterval(timer);
  }, [decreaseStats, decayOfflineStats, animals.length]);

  useEffect(() => {
    if (!myAnimal) return;
    const currentLevel = myAnimal.level || 1;
    if (currentLevel > prevLevelRef.current) {
      setShowLevelUpEffect(true);
      setTimeout(() => setShowLevelUpEffect(false), 3000);
    }
    prevLevelRef.current = currentLevel;
  }, [myAnimal?.level]);

  if (animals.length === 0 || isAdoptMode) {
    return <AdoptAnimal onFinish={() => setIsAdoptMode(false)} />;
  }

  if (!myAnimal) return <div className="bg-sky-300 w-full h-full"></div>;

  const getAnimalEmoji = (species: string, level: number) => {
    if (species === 'Dog') return level >= 3 ? '🐺' : level >= 2 ? '🐕' : '🐶';
    if (species === 'Cat') return level >= 3 ? '🐅' : level >= 2 ? '🐈' : '🐱';
    if (species === 'Chick') return level >= 3 ? '🐔' : level >= 2 ? '🐥' : '🐣';
    return '❓';
  };

  const handleActionWithFeedback = (actionFn: () => ActionFeedback | null, event: React.MouseEvent<HTMLButtonElement>) => {
    const result = actionFn();
    if (!result) return;
    const { clientX, clientY } = event;
    const offset = feedbackTexts.length * 20;
    const newFeedbacks: FeedbackText[] = [];
    const createFB = (text: string, color: string, yOff: number) => ({ id: Date.now() + yOff, text, x: clientX, y: clientY - 30 + yOff - offset, color });
    
    if (result.stats.hunger) newFeedbacks.push(createFB(`🍖 ${result.stats.hunger > 0 ? '+' : ''}${result.stats.hunger}`, 'text-orange-600', 0));
    if (result.stats.happiness) newFeedbacks.push(createFB(`❤️ ${result.stats.happiness > 0 ? '+' : ''}${result.stats.happiness}`, 'text-pink-600', -25));
    newFeedbacks.push(createFB(`💎 EXP +${result.stats.exp}`, 'text-blue-600', -50));
    
    setFeedbackTexts((prev) => [...prev, ...newFeedbacks]);
    setTimeout(() => { setFeedbackTexts((prev) => prev.filter((fb) => !newFeedbacks.some(n => n.id === fb.id))); }, 1500);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-sky-300">
      {isShopOpen && <ShopModal onClose={() => setIsShopOpen(false)} />}
      {isGameOpen && <MiniGameModal onClose={() => setIsGameOpen(false)} />}
      {isListOpen && <AnimalListModal onClose={() => setIsListOpen(false)} onAdoptNew={() => { setIsListOpen(false); setIsAdoptMode(true); }} />}

      {showLevelUpEffect && (
        <div className="absolute inset-0 bg-black/70 z-60 flex flex-col items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowLevelUpEffect(false)}>
          <div className="text-[15rem] leading-none mb-10">🎉</div>
          <h1 className="text-7xl font-extrabold text-yellow-300 drop-shadow-[0_4px_0_#ca8a04] animate-bounce">LEVEL UP!</h1>
          <p className="text-2xl font-bold text-white bg-gray-900 px-6 py-2 rounded-xl border-4 border-yellow-400">
            {myAnimal.name}가 레벨 <span className="text-yellow-400 text-3xl">{myAnimal.level}</span>이(가) 되었습니다!
          </p>
        </div>
      )}

      {/* 👇 최상단 고정(fixed) 및 z-index 9999 적용 */}
      {feedbackTexts.map((fb) => (
        <div 
          key={fb.id} 
          className={`fixed font-extrabold text-2xl animate-floating-text z-9999 pointer-events-none drop-shadow-md ${fb.color}`} 
          style={{ left: fb.x, top: fb.y }}
        >
          {fb.text}
        </div>
      ))}

      {myAnimal.isSick && <div className="absolute inset-0 bg-purple-900/30 z-0 animate-pulse pointer-events-none mix-blend-multiply"></div>}

      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className={`flex-5 ${myAnimal.isSick ? 'bg-sky-500' : 'bg-sky-300'} relative transition-colors duration-1000`}>
          <div className="absolute top-10 left-[20%] text-6xl opacity-80">☁️</div>
          <div className="absolute top-12 left-[40%] w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-[0_0_20px_#fde047]"></div>
        </div>
        <div className={`flex-3 ${myAnimal.isSick ? 'bg-green-600' : 'bg-green-400'} border-t-8 border-green-700 relative transition-colors duration-1000`}>
           <div className="absolute top-4 left-10 text-3xl opacity-60">🌿</div>
           <div className="absolute top-8 right-16 text-3xl opacity-60">🌼</div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-4 md:p-6">
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
              {/* 👇 userName과 farmName을 자연스럽게 통합 */}
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                {userName}의 {farmName}
              </h2>
            </div>
            <button onClick={() => setIsListOpen(true)} className="bg-white px-4 py-2 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.2)] font-black hover:bg-gray-100 active:translate-y-1 active:shadow-none transition-all">
              🐾 동물들 ({animals.length})
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsGameOpen(true)} className="bg-green-500 px-4 py-2 rounded-xl border-4 border-green-800 shadow-[4px_4px_0_#166534] text-white font-extrabold hover:bg-green-400 active:translate-y-1 transition-all">👨‍🌾 알바</button>
            <button onClick={() => setIsShopOpen(true)} className="bg-blue-400 px-4 py-2 rounded-xl border-4 border-blue-800 shadow-[4px_4px_0_#1e3a8a] text-white font-extrabold hover:bg-blue-300 active:translate-y-1 transition-all">🏪 상점</button>
            <div className="bg-yellow-300 px-4 py-2 rounded-xl border-4 border-yellow-700 shadow-[4px_4px_0_#854d0e] hidden md:block">
              <span className="text-lg font-extrabold text-yellow-900">💰 {points.toLocaleString()} P</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          {myAnimal.isSick && <div className="absolute -top-10 text-5xl animate-bounce">🤒</div>}
          <div className={`text-[10rem] md:text-[12rem] drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] transition-transform duration-300 ${myAnimal.isSick ? 'opacity-70 rotate-6' : myAnimal.hunger < 30 ? 'animate-bounce' : 'hover:-translate-y-4 cursor-pointer'}`}>
            {getAnimalEmoji(myAnimal.species, myAnimal.level || 1)}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur p-5 md:p-6 rounded-3xl border-4 border-gray-800 shadow-[0_10px_0_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-stretch w-full gap-0 relative overflow-hidden">
          {myAnimal.isSick && <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse"></div>}

					{/* 왼쪽 구역 */}
          <div className="w-full md:w-1/5 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-gray-200 pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="bg-yellow-400 text-yellow-900 font-extrabold px-2 py-1.5 rounded-xl border-2 border-gray-800 text-sm">Lv.{myAnimal.level || 1}</span>
              <span className={`text-xl lg:text-2xl font-extrabold mt-1 truncate ${myAnimal.isSick ? 'text-red-600' : 'text-gray-800'}`}>{myAnimal.name}</span>
            </div>
            <div className="w-full mt-auto">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5"><span>EXP</span><span>{myAnimal.exp || 0} / {(myAnimal.level || 1) * 100}</span></div>
              <div className="w-full bg-gray-200 rounded-full h-3.5 border-2 border-gray-800 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((myAnimal.exp || 0) / ((myAnimal.level || 1) * 100)) * 100}%` }}></div>
              </div>
            </div>
          </div>

					{/* 중앙 구역 */}
          <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4 border-b-4 md:border-b-0 md:border-r-4 border-gray-200 py-4 md:py-0 md:px-6">
            <div>
              <div className="flex justify-between text-base font-bold mb-1.5 text-gray-800"><span>🍖 포만감</span><span className={myAnimal.hunger < 30 ? 'text-red-500' : ''}>{myAnimal.hunger} / 100</span></div>
              <div className="w-full bg-gray-300 rounded-full h-4.5 border-2 border-gray-800 overflow-hidden"><div className={`h-full transition-all duration-500 ${myAnimal.hunger < 30 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${myAnimal.hunger}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-base font-bold mb-1.5 text-gray-800"><span>❤️ 행복도</span><span className={myAnimal.happiness < 30 ? 'text-red-500' : ''}>{myAnimal.happiness} / 100</span></div>
              <div className="w-full bg-gray-300 rounded-full h-4.5 border-2 border-gray-800 overflow-hidden"><div className="bg-pink-400 h-full transition-all duration-500" style={{ width: `${myAnimal.happiness}%` }}></div></div>
            </div>
          </div>

					{/* 오른쪽 구역 */}
          <div className="w-full md:w-2/5 flex gap-2 lg:gap-4 justify-center md:justify-end items-center pt-4 md:pt-0 md:pl-6">
            <button onClick={(e) => handleActionWithFeedback(baseFeed, e)} disabled={myAnimal.hunger >= 100 || inventory.food <= 0} className="relative group flex flex-col items-center justify-center bg-orange-400 hover:bg-orange-300 text-white w-16 h-16 lg:w-24 lg:h-24 rounded-2xl shadow-[0_6px_0_#9a3412] border-4 border-orange-900 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50">
              <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.food}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">🍖</span><span className="text-xs lg:text-lg font-extrabold text-orange-900">밥주기</span>
            </button>
            <button onClick={(e) => handleActionWithFeedback(basePlay, e)} disabled={myAnimal.happiness >= 100 || inventory.toy <= 0 || myAnimal.isSick} className="relative group flex flex-col items-center justify-center bg-pink-400 hover:bg-pink-300 text-white w-16 h-16 lg:w-24 lg:h-24 rounded-2xl shadow-[0_6px_0_#831843] border-4 border-pink-900 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50">
              <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.toy}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">🎾</span><span className="text-xs lg:text-lg font-extrabold text-pink-900">놀아주기</span>
            </button>
            <button onClick={(e) => handleActionWithFeedback(baseCure, e)} disabled={!myAnimal.isSick || inventory.medicine <= 0} className={`relative group flex flex-col items-center justify-center w-16 h-16 lg:w-24 lg:h-24 rounded-2xl transition-all border-4 ${myAnimal.isSick && inventory.medicine > 0 ? 'bg-red-500 border-red-900 shadow-[0_6px_0_#7f1d1d] animate-pulse active:translate-y-1.5' : 'bg-gray-300 border-gray-600 shadow-[0_6px_0_#4b5563]'} disabled:opacity-50`}>
              <span className="absolute -top-3 -right-3 bg-red-700 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.medicine}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">💊</span><span className={`text-xs lg:text-lg font-extrabold ${myAnimal.isSick ? 'text-white' : 'text-gray-600'}`}>치료</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmMain;