import { useEffect, useState } from 'react';
import { useUserStore, getRankInfo } from '../store/useUserStore';
import { useBankStore } from '../store/useBankStore';
import { useAnimalStore } from '../store/useAnimalStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useGameActions, type ActionFeedback } from '../hooks/useGameActions';
import { useAlertStore } from '../store/useAlertStore'; // 👈 알림 스토어 임포트
import AdoptAnimal from './AdoptAnimal';
import ShopModal from './ShopModal';
import MiniGameModal from './MiniGameModal';
import AnimalListModal from './AnimalListModal';
import UserProfileModal from './UserProfileModal';
import AnimalHospitalModal from './AnimalHospitalModal';
import BankModal from './BankModal';
import GlobalAlert from './GlobalAlert'; // 👈 글로벌 알림 컴포넌트 임포트

interface FeedbackText { id: number; text: string; x: number; y: number; color: string; }

const THEME_STYLES = {
  default: { sky: 'bg-sky-300', ground: 'bg-green-400', border: 'border-green-700', sun: 'bg-yellow-400', cloud: '☁️' },
  night: { sky: 'bg-indigo-950', ground: 'bg-emerald-950', border: 'border-gray-900', sun: 'bg-gray-100 shadow-[0_0_30px_#ffffff]', cloud: '⭐' },
  sunset: { sky: 'bg-orange-400', ground: 'bg-amber-700', border: 'border-amber-900', sun: 'bg-red-500', cloud: '☁️' },
  beach: { sky: 'bg-cyan-200', ground: 'bg-yellow-200', border: 'border-yellow-500', sun: 'bg-orange-400', cloud: '☁️' },
};

const FarmMain = () => {
  const { farmName, userName, points, currentTheme, graduatedCount, addGraduatedCount } = useUserStore();
  const applyDailyInterest = useBankStore((state) => state.applyDailyInterest);
  const { animals, activeAnimalId, decreaseStats, decayOfflineStats, graduateAnimal } = useAnimalStore();
  const inventory = useInventoryStore();
  const { feedAnimal: baseFeed, playWithAnimal: basePlay } = useGameActions();
  const { showAlert, showConfirm } = useAlertStore(); // 👈 알림창 함수 가져오기
  
  const myAnimal = animals.find(a => a.id === activeAnimalId);
  const curTheme = THEME_STYLES[currentTheme || 'default'];

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false); 
  const [isAdoptMode, setIsAdoptMode] = useState(false);

  const [feedbackTexts, setFeedbackTexts] = useState<FeedbackText[]>([]);
  const { title: rankTitle } = getRankInfo(graduatedCount);

  useEffect(() => {
    applyDailyInterest();
  }, [applyDailyInterest]);

  // 👇 기본 confirm 대신 showConfirm 사용
  const handleGraduation = () => {
    if (!myAnimal) return;
    showConfirm(
      `${myAnimal.name}이(가) 호감도가 가득 차\n독립할 준비가 되었습니다!\n\n엔딩을 보시겠습니까?\n(되돌릴 수 없습니다)`,
      () => {
        addGraduatedCount();
        graduateAnimal(myAnimal.id);
        showAlert('동물이 훌륭하게 자라 농장을 떠났습니다.\n계급 점수가 올랐습니다!');
      }
    );
  };

  useEffect(() => {
    if (animals.length === 0) return;
    decayOfflineStats(); 
    const timer = setInterval(() => { decreaseStats(); }, 60000);
    return () => clearInterval(timer);
  }, [decreaseStats, decayOfflineStats, animals.length]);

  if (animals.length === 0 || isAdoptMode) return <AdoptAnimal onFinish={() => setIsAdoptMode(false)} />;
  if (!myAnimal) return <div className="bg-sky-300 w-full h-full"></div>;

  const getAnimalEmoji = (species: string, affection: number) => {
    if (species === 'Dog') return affection >= 100 ? '🐺' : affection >= 50 ? '🐕' : '🐶';
    if (species === 'Cat') return affection >= 100 ? '🐅' : affection >= 50 ? '🐈' : '🐱';
    if (species === 'Chick') return affection >= 100 ? '🐔' : affection >= 50 ? '🐥' : '🐣';
    return '❓';
  };

  const getEvolutionStage = (affection: number) => {
    if (affection >= 100) return '성체 (3단계)';
    if (affection >= 50) return '성장기 (2단계)';
    return '유년기 (1단계)';
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
    if (result.stats.affection) newFeedbacks.push(createFB(`💖 호감도 +${result.stats.affection}`, 'text-pink-500', -50));
    
    setFeedbackTexts((prev) => [...prev, ...newFeedbacks]);
    setTimeout(() => { setFeedbackTexts((prev) => prev.filter((fb) => !newFeedbacks.some(n => n.id === fb.id))); }, 1500);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-black">
      {isShopOpen && <ShopModal onClose={() => setIsShopOpen(false)} />}
      {isGameOpen && <MiniGameModal onClose={() => setIsGameOpen(false)} />}
      {isListOpen && <AnimalListModal onClose={() => setIsListOpen(false)} onAdoptNew={() => { setIsListOpen(false); setIsAdoptMode(true); }} />}
      {isProfileOpen && <UserProfileModal onClose={() => setIsProfileOpen(false)} />}
      {isHospitalOpen && <AnimalHospitalModal onClose={() => setIsHospitalOpen(false)} />}
      {isBankOpen && <BankModal onClose={() => setIsBankOpen(false)} />}

      <GlobalAlert /> {/* 모든 알림창을 처리할 최상위 모달 렌더링 */}

      {feedbackTexts.map((fb) => (
        <div key={fb.id} className={`fixed font-extrabold text-2xl animate-floating-text z-[9999] pointer-events-none drop-shadow-md ${fb.color}`} style={{ left: fb.x, top: fb.y }}>
          {fb.text}
        </div>
      ))}

      {myAnimal.isSick && <div className="absolute inset-0 bg-purple-900/40 z-0 animate-pulse pointer-events-none mix-blend-multiply"></div>}

      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className={`flex-[5] ${myAnimal.isSick ? 'bg-purple-900' : curTheme.sky} relative transition-colors duration-1000`}>
          <div className="absolute top-10 left-[20%] text-6xl opacity-80">{curTheme.cloud}</div>
          <div className="absolute top-24 right-[25%] text-5xl opacity-60">{curTheme.cloud}</div>
          <div className={`absolute top-12 left-[40%] w-16 h-16 rounded-full border-4 ${curTheme.sun} border-transparent`}></div>
        </div>
        <div className={`flex-[3] ${myAnimal.isSick ? 'bg-purple-950' : curTheme.ground} border-t-8 ${curTheme.border} relative transition-colors duration-1000`}>
           {currentTheme === 'default' && <><div className="absolute top-4 left-10 text-3xl opacity-60">🌿</div><div className="absolute top-8 right-16 text-3xl opacity-60">🌼</div></>}
           {currentTheme === 'beach' && <><div className="absolute top-4 left-10 text-3xl opacity-80">🐚</div><div className="absolute top-8 right-20 text-4xl opacity-80">🦀</div></>}
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-4 md:p-6">
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsProfileOpen(true)} 
              className="bg-white px-4 py-2 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.2)] flex flex-col min-w-[140px] justify-center hover:bg-gray-100 active:translate-y-[4px] active:shadow-none transition-all text-left"
            >
              <div className="flex items-center mb-0.5">
                <span className="text-sm font-black text-blue-600">{rankTitle}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800 truncate">{userName}의 {farmName}</h2>
            </button>
            <button onClick={() => setIsListOpen(true)} className="bg-white px-4 py-2 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.2)] font-black hover:bg-gray-100 active:translate-y-[4px] active:shadow-none transition-all hidden md:block">
              🐾 동물들 ({animals.length})
            </button>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={() => setIsGameOpen(true)} className="bg-green-500 px-4 py-2 rounded-xl border-4 border-green-800 shadow-[4px_4px_0_#166534] text-white font-extrabold hover:bg-green-400 active:translate-y-[4px] transition-all">👨‍🌾 알바</button>
            <button onClick={() => setIsShopOpen(true)} className="bg-blue-400 px-4 py-2 rounded-xl border-4 border-blue-800 shadow-[4px_4px_0_#1e3a8a] text-white font-extrabold hover:bg-blue-300 active:translate-y-[4px] transition-all">🏪 상점</button>
            <button onClick={() => setIsBankOpen(true)} className="bg-orange-400 px-4 py-2 rounded-xl border-4 border-orange-800 shadow-[4px_4px_0_#9a3412] text-white font-extrabold hover:bg-orange-300 active:translate-y-[4px] transition-all">🏦 은행</button>
            <div className="bg-yellow-300 px-4 py-2 rounded-xl border-4 border-yellow-700 shadow-[4px_4px_0_#854d0e] hidden lg:block">
              <span className="text-lg font-extrabold text-yellow-900">💰 {points.toLocaleString()} P</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          {myAnimal && (myAnimal.affection || 0) >= 100 && (
            <button onClick={handleGraduation} className="absolute top-10 md:top-20 z-20 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-black text-xl border-4 border-yellow-600 shadow-[0_6px_0_#ca8a04] hover:bg-yellow-300 hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all animate-bounce">
              🎓 독립시키기 (엔딩)
            </button>
          )}
					
          {myAnimal.isSick && <div className="absolute -top-10 text-5xl animate-bounce">🤒</div>}
          <div className={`text-[10rem] md:text-[12rem] drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] transition-transform duration-300 ${myAnimal.isSick ? 'opacity-70 rotate-6' : myAnimal.hunger < 30 ? 'animate-bounce' : 'hover:-translate-y-4 cursor-pointer'}`}>
            {getAnimalEmoji(myAnimal.species, myAnimal.affection || 0)}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur p-5 md:p-6 rounded-3xl border-4 border-gray-800 shadow-[0_10px_0_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center w-full gap-6 relative overflow-hidden">
          {myAnimal.isSick && <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse"></div>}

          <div className="w-full md:w-1/5 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-gray-200 pb-4 md:pb-0 md:pr-4">
            <div className="flex flex-col gap-2 mb-4 md:mb-0">
              <span className={`text-xl lg:text-2xl font-extrabold truncate ${myAnimal.isSick ? 'text-red-600' : 'text-gray-800'}`}>{myAnimal.name}</span>
              <span className="bg-purple-100 text-purple-700 font-extrabold px-3 py-1.5 rounded-xl border-2 border-purple-300 text-xs w-fit">
                {getEvolutionStage(myAnimal.affection || 0)}
              </span>
            </div>
            <div className="w-full mt-auto">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                <span>💖 호감도</span>
                <span className="text-pink-500">{myAnimal.affection || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3.5 border-2 border-gray-800 overflow-hidden">
                <div className="h-full bg-pink-400 transition-all duration-300" style={{ width: `${myAnimal.affection || 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex flex-col justify-center space-y-4 border-b-4 md:border-b-0 md:border-r-4 border-gray-200 py-4 md:py-0 md:px-6">
            <div>
              <div className="flex justify-between text-base font-bold mb-1.5 text-gray-800"><span>🍖 포만감</span><span className={myAnimal.hunger < 30 ? 'text-red-500' : ''}>{myAnimal.hunger} / 100</span></div>
              <div className="w-full bg-gray-300 rounded-full h-4.5 border-2 border-gray-800 overflow-hidden"><div className={`h-full transition-all duration-500 ${myAnimal.hunger < 30 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${myAnimal.hunger}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-base font-bold mb-1.5 text-gray-800"><span>❤️ 행복도</span><span className={myAnimal.happiness < 30 ? 'text-red-500' : ''}>{myAnimal.happiness} / 100</span></div>
              <div className="w-full bg-gray-300 rounded-full h-4.5 border-2 border-gray-800 overflow-hidden"><div className="bg-pink-400 h-full transition-all duration-500" style={{ width: `${myAnimal.happiness}%` }}></div></div>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex gap-2 lg:gap-4 justify-center md:justify-end items-center pt-4 md:pt-0 md:pl-6">
            <button onClick={(e) => handleActionWithFeedback(baseFeed, e)} disabled={myAnimal.hunger >= 100 || inventory.food <= 0} className="relative group flex flex-col items-center justify-center bg-orange-400 hover:bg-orange-300 text-white w-16 h-16 lg:w-24 lg:h-24 rounded-2xl shadow-[0_6px_0_#9a3412] border-4 border-orange-900 active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50">
              <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.food}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">🍖</span><span className="text-xs lg:text-lg font-extrabold text-orange-900">밥주기</span>
            </button>
            <button onClick={(e) => handleActionWithFeedback(basePlay, e)} disabled={myAnimal.happiness >= 100 || inventory.toy <= 0 || myAnimal.isSick} className="relative group flex flex-col items-center justify-center bg-pink-400 hover:bg-pink-300 text-white w-16 h-16 lg:w-24 lg:h-24 rounded-2xl shadow-[0_6px_0_#831843] border-4 border-pink-900 active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50">
              <span className="absolute -top-3 -right-3 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-xs">{inventory.toy}</span>
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">🎾</span><span className="text-xs lg:text-lg font-extrabold text-pink-900">놀아주기</span>
            </button>
            <button 
              onClick={() => setIsHospitalOpen(true)} 
              className={`relative group flex flex-col items-center justify-center w-16 h-16 lg:w-24 lg:h-24 rounded-2xl transition-all border-4 ${myAnimal.isSick 
                ? 'bg-red-500 hover:bg-red-400 border-red-900 shadow-[0_6px_0_#7f1d1d] animate-pulse active:translate-y-[6px]' 
                : 'bg-gray-300 hover:bg-gray-200 border-gray-600 shadow-[0_6px_0_#4b5563] active:translate-y-[6px]'
              }`}
            >
              <span className="text-xl lg:text-3xl mb-1 group-active:scale-90">🏥</span>
              <span className={`text-xs lg:text-lg font-extrabold ${myAnimal.isSick ? 'text-white' : 'text-gray-600'}`}>병원</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmMain;