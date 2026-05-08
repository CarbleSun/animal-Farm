import { useGameActions } from '../hooks/useGameActions';
import { useUserStore } from '../store/useUserStore';

interface ShopModalProps {
  onClose: () => void;
}

const ShopModal = ({ onClose }: ShopModalProps) => {
  const points = useUserStore((state) => state.points);
  const { buyItem } = useGameActions();

  const handleBuy = (type: 'food' | 'toy', price: number, amount: number) => {
    if (points >= price) {
      buyItem(type, price, amount);
      // 플래시 느낌의 간단한 효과음이나 알림을 넣을 수 있는 자리입니다.
    } else {
      alert("포인트가 부족합니다! 😭");
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-orange-50 w-full max-w-lg rounded-4xl border-8 border-orange-800 shadow-[10px_10px_0_rgba(0,0,0,0.5)] p-6 relative">
        
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 text-white w-12 h-12 rounded-full border-4 border-red-900 font-extrabold text-2xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-0.5 hover:shadow-[0_2px_0_#7f1d1d] active:shadow-none active:translate-y-1"
        >
          X
        </button>

        <h2 className="text-3xl font-extrabold text-orange-900 mb-6 text-center border-b-4 border-orange-200 pb-4">
          🏪 잡화점
        </h2>

        <div className="flex justify-between items-center bg-yellow-100 p-3 rounded-xl border-4 border-yellow-300 mb-6">
          <span className="font-bold text-yellow-900">내 포인트</span>
          <span className="text-xl font-extrabold text-yellow-900">💰 {points.toLocaleString()} P</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 영양 만점 사료 */}
          <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center text-center shadow-sm">
            <span className="text-5xl mb-2 drop-shadow-md">🍖</span>
            <span className="font-extrabold text-lg text-gray-800">영양 사료</span>
            <span className="text-sm text-gray-500 mb-4">포만감 +30</span>
            <button 
              onClick={() => handleBuy('food', 100, 1)}
              className="w-full bg-blue-500 text-white py-2 rounded-xl font-bold border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
            >
              100 P
            </button>
          </div>

          {/* 최고급 장난감 */}
          <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center text-center shadow-sm">
            <span className="text-5xl mb-2 drop-shadow-md">🎾</span>
            <span className="font-extrabold text-lg text-gray-800">탱탱볼</span>
            <span className="text-sm text-gray-500 mb-4">행복도 +30</span>
            <button 
              onClick={() => handleBuy('toy', 150, 1)}
              className="w-full bg-blue-500 text-white py-2 rounded-xl font-bold border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
            >
              150 P
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;