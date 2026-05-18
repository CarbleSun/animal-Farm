import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useBankStore } from '../store/useBankStore';
import { useAnimalStore } from '../store/useAnimalStore';
import AdoptAnimal from './AdoptAnimal';
import ShopView from './ShopView';
import BankView from './BankView';
import AnimalListView from './AnimalListView';
import MiniGameModal from './MiniGameModal';
import UserProfileModal from './UserProfileModal';
import GlobalAlert from './GlobalAlert';
import UserSidebar, { type ViewType } from './UserSidebar';
import AnimalDetailView from './AnimalDetailView'; // 👈 신규 뷰 페이지 임포트

const THEME_STYLES = {
  default: { sky: 'bg-sky-300', ground: 'bg-green-400', border: 'border-green-700', sun: 'bg-yellow-400', cloud: '☁️' },
  night: { sky: 'bg-indigo-950', ground: 'bg-emerald-950', border: 'border-gray-900', sun: 'bg-gray-100 shadow-[0_0_30px_#ffffff]', cloud: '⭐' },
  sunset: { sky: 'bg-orange-400', ground: 'bg-amber-700', border: 'border-amber-900', sun: 'bg-red-500', cloud: '☁️' },
  beach: { sky: 'bg-cyan-200', ground: 'bg-yellow-200', border: 'border-yellow-500', sun: 'bg-orange-400', cloud: '☁️' },
};

const FarmMain = () => {
  const { currentTheme } = useUserStore();
  const applyDailyInterest = useBankStore((state) => state.applyDailyInterest);
  const { animals, setActiveAnimal, decreaseStats, decayOfflineStats } = useAnimalStore();
  const curTheme = THEME_STYLES[currentTheme || 'default'];

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('farm');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdoptMode, setIsAdoptMode] = useState(false);
  const [detailAnimalId, setDetailAnimalId] = useState<string | null>(null);

  useEffect(() => {
    applyDailyInterest();
  }, [applyDailyInterest]);

  useEffect(() => {
    if (animals.length === 0) return;
    decayOfflineStats(); 
    const timer = setInterval(() => { decreaseStats(); }, 60000);
    return () => clearInterval(timer);
  }, [decreaseStats, decayOfflineStats, animals.length]);

  if (animals.length === 0 || isAdoptMode) return <AdoptAnimal onFinish={() => setIsAdoptMode(false)} />;

  const getAnimalEmoji = (species: string, affection: number) => {
    if (species === 'Dog') return affection >= 100 ? '🐺' : affection >= 50 ? '🐕' : '🐶';
    if (species === 'Cat') return affection >= 100 ? '🐅' : affection >= 50 ? '🐈' : '🐱';
    if (species === 'Chick') return affection >= 100 ? '🐔' : affection >= 50 ? '🐥' : '🐣';
    return '❓';
  };

  return (
    <div className="flex flex-row w-full h-full overflow-hidden bg-white relative">
      
      <UserSidebar 
        isOpen={isSidebarOpen}
        currentView={currentView}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onChangeView={(view) => { setCurrentView(view); setIsSidebarOpen(false); }}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
        
        {/* 모든 뷰의 공통 사이드바 오픈 버튼 */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-60 bg-white/90 px-4 py-3 rounded-xl border-4 border-[#a3d130] font-black text-gray-700 shadow-md hover:bg-green-50 active:translate-y-1 transition-all flex items-center gap-2"
          >
            <span className="text-xl leading-none">☰</span> 메뉴
          </button>
        )}

        {/* --- 페이지 뷰 라우터 연동 --- */}
        {currentView === 'farm' && (
          <div className={`absolute inset-0 flex flex-col ${curTheme.sky} transition-colors duration-1000`}>
            <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
              <div className="flex-5 relative">
                <div className="absolute top-10 left-[20%] text-6xl opacity-80">{curTheme.cloud}</div>
                <div className="absolute top-24 right-[25%] text-5xl opacity-60">{curTheme.cloud}</div>
                <div className={`absolute top-12 left-[40%] w-16 h-16 rounded-full border-4 ${curTheme.sun} border-transparent`}></div>
              </div>
              <div className={`flex-3 ${curTheme.ground} border-t-8 ${curTheme.border} relative`}>
                 {currentTheme === 'default' && <><div className="absolute top-4 left-10 text-3xl opacity-60">🌿</div><div className="absolute top-8 right-16 text-3xl opacity-60">🌼</div></>}
                 {currentTheme === 'beach' && <><div className="absolute top-4 left-10 text-3xl opacity-80">🐚</div><div className="absolute top-8 right-20 text-4xl opacity-80">🦀</div></>}
              </div>
            </div>

            <div className="absolute inset-0 z-10 flex flex-wrap items-end justify-center md:justify-around gap-4 pb-16 px-10 pointer-events-none">
              {animals.map((a) => (
                <div 
                  key={a.id} 
                  className="relative group pointer-events-auto cursor-pointer hover:-translate-y-4 transition-transform" 
                  onClick={() => { 
                    setActiveAnimal(a.id); 
                    setDetailAnimalId(a.id); 
                    setCurrentView('detail'); // 👈 농장에서 동물 클릭 시 detail 뷰로 전환
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className={`text-[6rem] md:text-[8rem] drop-shadow-2xl ${a.isSick ? 'opacity-70 rotate-6' : a.hunger < 30 ? 'animate-bounce' : ''}`}>
                    {getAnimalEmoji(a.species, a.affection || 0)}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-xl text-xs font-black text-gray-800 shadow-sm border-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                    {a.name}
                  </div>
                  {a.isSick && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce">🤒</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 👇 신규 동물 상세 프로필 페이지 */}
        {currentView === 'detail' && detailAnimalId && (
          <AnimalDetailView 
            animalId={detailAnimalId} 
            onGraduated={() => setCurrentView('farm')} 
          />
        )}

        {currentView === 'list' && (
          <AnimalListView 
            onAdoptNew={() => { setCurrentView('farm'); setIsAdoptMode(true); }} 
            onOpenDetail={(id) => { 
              setDetailAnimalId(id); 
              setCurrentView('detail'); // 👈 리스트에서 동물 클릭 시 detail 뷰로 전환
              setIsSidebarOpen(false); 
            }} 
          />
        )}

        {currentView === 'shop' && <ShopView />}

        {currentView === 'bank' && <BankView />}

        {currentView === 'game' && <MiniGameModal onClose={() => setCurrentView('farm')} />}

        {isProfileOpen && <UserProfileModal onClose={() => setIsProfileOpen(false)} />}
        <GlobalAlert />
        
      </div>
    </div>
  );
};

export default FarmMain;