import { useUserStore } from '../store/useUserStore';
import { useGameActions } from '../hooks/useGameActions';

interface ShopModalProps {
  onClose: () => void;
}

const ShopModal = ({ onClose }: ShopModalProps) => {
  const points = useUserStore((state) => state.points);
  const { buyItem } = useGameActions();

  const handleBuy = (type: 'food' | 'toy' | 'medicine', price: number, amount: number) => {
    if (!buyItem(type, price, amount)) {
      alert("포인트가 부족합니다! 😭");
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-orange-50 w-full max-w-2xl rounded-[2rem] border-8 border-orange-800 shadow-[10px_10px_0_rgba(0,0,0,0.5)] p-6 relative">
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-red-500 text-white w-12 h-12 rounded-full border-4 border-red-900 font-extrabold text-2xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-[2px] active:translate-y-[4px]">X</button>
        <h2 className="text-3xl font-extrabold text-orange-900 mb-6 text-center border-b-4 border-orange-200 pb-4">🏪 잡화점</h2>
        
        <div className="flex justify-between items-center bg-yellow-100 p-3 rounded-xl border-4 border-yellow-300 mb-6">
          <span className="font-bold text-yellow-900">내 포인트</span>
          <span className="text-xl font-extrabold text-yellow-900">💰 {points.toLocaleString()} P</span>
        </div>

        {/* 상품 3개 배치로 grid 수정 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center text-center shadow-sm">
            <span className="text-5xl mb-2">🍖</span>
            <span className="font-extrabold text-lg text-gray-800">영양 사료</span>
            <span className="text-sm text-gray-500 mb-4">포만감 +30</span>
            <button onClick={() => handleBuy('food', 100, 1)} className="w-full bg-blue-500 text-white py-2 rounded-xl font-bold border-b-4 border-blue-800 active:border-b-0 active:translate-y-[4px]">100 P</button>
          </div>
          <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center text-center shadow-sm">
            <span className="text-5xl mb-2">🎾</span>
            <span className="font-extrabold text-lg text-gray-800">탱탱볼</span>
            <span className="text-sm text-gray-500 mb-4">행복도 +30</span>
            <button onClick={() => handleBuy('toy', 150, 1)} className="w-full bg-blue-500 text-white py-2 rounded-xl font-bold border-b-4 border-blue-800 active:border-b-0 active:translate-y-[4px]">150 P</button>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border-4 border-red-200 flex flex-col items-center text-center shadow-sm">
            <span className="text-5xl mb-2">💊</span>
            <span className="font-extrabold text-lg text-red-800">구급상자</span>
            <span className="text-sm text-red-500 mb-4">질병 치료</span>
            <button onClick={() => handleBuy('medicine', 200, 1)} className="w-full bg-red-500 text-white py-2 rounded-xl font-bold border-b-4 border-red-800 active:border-b-0 active:translate-y-[4px]">200 P</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;