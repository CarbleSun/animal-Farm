import { useUserStore, getRankInfo } from '../store/useUserStore';

interface UserProfileModalProps {
  onClose: () => void;
}

const UserProfileModal = ({ onClose }: UserProfileModalProps) => {
  const { farmName, userName, points, graduatedCount } = useUserStore();
  const { title, maxCapacity } = getRankInfo(graduatedCount);

  return (
    <div className="absolute inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] border-8 border-gray-800 shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col items-center">
        
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-red-500 text-white w-11 h-11 rounded-full border-4 border-red-900 font-extrabold text-xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-[2px] active:translate-y-[4px]">X</button>

        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b-4 border-gray-200 pb-3 w-full text-center">🧑‍🌾 농장주 프로필</h2>

        <div className="text-6xl mb-4 bg-gray-100 p-4 rounded-full border-4 border-gray-300">
          {title.split(' ')[0]}
        </div>

        <div className="w-full bg-blue-50 rounded-2xl border-4 border-blue-200 p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-500 text-sm">농장 이름</span>
            <span className="font-extrabold text-gray-800 text-lg">{farmName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-500 text-sm">농장주</span>
            <span className="font-extrabold text-gray-800 text-lg">{userName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-500 text-sm">현재 계급</span>
            <span className="font-black text-blue-600 text-lg">{title}</span>
          </div>
        </div>

        <div className="w-full bg-yellow-50 rounded-2xl border-4 border-yellow-200 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-500 text-sm">총 엔딩 횟수</span>
            <span className="font-black text-yellow-700">{graduatedCount} 회</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-500 text-sm">최대 사육 마릿수</span>
            <span className="font-black text-yellow-700">{maxCapacity} 마리</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-500 text-sm">보유 포인트</span>
            <span className="font-black text-yellow-700">{points.toLocaleString()} P</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;