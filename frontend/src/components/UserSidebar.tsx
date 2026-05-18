import { useUserStore, getRankInfo } from '../store/useUserStore';

// 👇 'detail' 뷰 타입 추가
export type ViewType = 'farm' | 'list' | 'game' | 'shop' | 'bank' | 'detail';

interface UserSidebarProps {
  isOpen: boolean;
  currentView: ViewType;
  onToggle: () => void;
  onChangeView: (view: ViewType) => void;
  onOpenProfile: () => void;
}

const UserSidebar = ({ isOpen, currentView, onToggle, onChangeView, onOpenProfile }: UserSidebarProps) => {
  const { farmName, userName, points, graduatedCount } = useUserStore();
  const { title: rankTitle } = getRankInfo(graduatedCount);

  const getMenuClass = (view: ViewType) => {
    const baseClass = "px-4 py-3 rounded-xl border-4 font-black transition-all text-left flex items-center gap-2 ";
    if (currentView === view) {
      return baseClass + "bg-green-100 border-green-500 text-green-900 shadow-inner";
    }
    return baseClass + "bg-white border-[#a3d130] text-gray-700 hover:bg-green-50 active:translate-y-1 shadow-sm";
  };

  return (
    <div className={`transition-all duration-300 ease-in-out shrink-0 bg-[#d4f874] border-[#a3d130] z-40 overflow-hidden ${isOpen ? 'w-full md:w-64 border-r-8' : 'w-0 border-r-0'} h-full absolute md:relative left-0 top-0 flex flex-col shadow-2xl md:shadow-none`}>
      <div className="p-4 w-full md:w-64 min-w-[256px] h-full flex flex-col">
        <div className="flex justify-between items-start mb-4 mt-2">
           <div className="text-6xl drop-shadow-md hidden md:block">🏡</div>
           <button onClick={onToggle} className="bg-white/80 px-3 py-2 rounded-xl border-4 border-[#94c125] font-black text-gray-700 hover:bg-white active:translate-y-1 transition-all md:ml-auto shadow-sm">
             ◀ 닫기
           </button>
        </div>

        <button
          onClick={onOpenProfile}
          className="bg-white/80 p-4 rounded-2xl border-4 border-[#94c125] flex flex-col text-left hover:bg-white active:translate-y-1 transition-all mb-4 shadow-sm shrink-0"
        >
          <span className="text-sm font-black text-green-700 mb-1">{rankTitle}</span>
          <h2 className="text-sm font-bold text-gray-600 truncate leading-tight">농장주인: <span className="text-gray-900">{userName}</span></h2>
          <h2 className="text-sm font-bold text-gray-600 truncate mb-2">소속마을: <span className="text-gray-900">{farmName}</span></h2>
          <div className="bg-green-100 text-green-800 text-xs font-black px-2 py-1.5 rounded-lg border border-green-300 w-fit">
            내 포인트: {points.toLocaleString()} P
          </div>
        </button>

        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pb-2">
          <button onClick={() => onChangeView('farm')} className={getMenuClass('farm')}>
            🌱 농장 홈
          </button>
          <button onClick={() => onChangeView('list')} className={getMenuClass('list')}>
            🐾 동물 관리
          </button>
          <button onClick={() => onChangeView('game')} className={getMenuClass('game')}>
            👨‍🌾 알바하기
          </button>
          <button onClick={() => onChangeView('shop')} className={getMenuClass('shop')}>
            🏪 상점
          </button>
          <button onClick={() => onChangeView('bank')} className={getMenuClass('bank')}>
            🏦 은행
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;