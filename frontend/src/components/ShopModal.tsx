import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useUserStore, type ThemeType } from '../store/useUserStore';
import { useAlertStore } from '../store/useAlertStore';

interface ShopModalProps { onClose: () => void; }

const THEMES: { id: ThemeType; name: string; price: number; icon: string; desc: string }[] = [
  { id: 'night', name: '고요한 밤', price: 3000, icon: '🌙', desc: '별이 빛나는 밤하늘' },
  { id: 'sunset', name: '노을 지는 저녁', price: 4000, icon: '🌅', desc: '따뜻한 노을빛' },
  { id: 'beach', name: '여름 해변', price: 5000, icon: '🌊', desc: '시원한 바닷가' },
];

const ShopModal = ({ onClose }: ShopModalProps) => {
  const { points, spendPoints, currentTheme, ownedThemes, buyTheme, setTheme } = useUserStore();
  const addItem = useInventoryStore((state) => state.addItem);
  const showAlert = useAlertStore((state) => state.showAlert); // 👈 알림 함수 임포트
  const [tab, setTab] = useState<'item' | 'deco'>('item');

  const handleBuyItem = (type: 'food' | 'toy', price: number, amount: number) => {
    if (spendPoints(price)) {
      addItem(type, amount);
      showAlert('구매가 완료되었습니다!');
    } else {
      showAlert('포인트가 부족합니다.');
    }
  };

  const handleBuyTheme = (theme: ThemeType, price: number) => {
    if (buyTheme(theme, price)) showAlert('테마 구매가 완료되었습니다!');
    else showAlert('포인트가 부족합니다.');
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-blue-50 w-full max-w-lg rounded-[2rem] border-8 border-blue-800 shadow-[10px_10px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col">
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-red-500 text-white w-12 h-12 rounded-full border-4 border-red-900 font-extrabold text-2xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-[2px] active:translate-y-[4px] z-10">X</button>
        
        <h2 className="text-3xl font-extrabold text-blue-900 mb-4 text-center">🏪 만물상</h2>
        
        <div className="flex mb-4 bg-blue-200 rounded-xl p-1 border-2 border-blue-300">
          <button onClick={() => setTab('item')} className={`flex-1 py-2 font-bold rounded-lg transition-all ${tab === 'item' ? 'bg-white shadow-sm text-blue-800' : 'text-blue-600 hover:bg-blue-100'}`}>소모품</button>
          <button onClick={() => setTab('deco')} className={`flex-1 py-2 font-bold rounded-lg transition-all ${tab === 'deco' ? 'bg-white shadow-sm text-blue-800' : 'text-blue-600 hover:bg-blue-100'}`}>농장 꾸미기</button>
        </div>

        <div className="bg-yellow-300 text-yellow-900 font-black py-2 px-4 rounded-xl border-4 border-yellow-600 self-center mb-6">
          내 지갑: {points.toLocaleString()} P
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[50vh] space-y-3">
          {tab === 'item' ? (
            <>
              <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🍖</span>
                  <div>
                    <p className="font-bold text-lg text-gray-800">사료 (5개)</p>
                    <p className="text-sm font-bold text-gray-500">포만감을 채워줍니다.</p>
                  </div>
                </div>
                <button onClick={() => handleBuyItem('food', 200, 5)} className="bg-yellow-400 hover:bg-yellow-300 font-black px-4 py-2 rounded-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-[90px]">200 P</button>
              </div>
              <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🎾</span>
                  <div>
                    <p className="font-bold text-lg text-gray-800">장난감 (3개)</p>
                    <p className="text-sm font-bold text-gray-500">행복도를 올려줍니다.</p>
                  </div>
                </div>
                <button onClick={() => handleBuyItem('toy', 300, 3)} className="bg-yellow-400 hover:bg-yellow-300 font-black px-4 py-2 rounded-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-[90px]">300 P</button>
              </div>
            </>
          ) : (
            <>
              {THEMES.map((t) => {
                const isOwned = ownedThemes?.includes(t.id);
                const isCurrent = currentTheme === t.id;
                return (
                  <div key={t.id} className={`bg-white p-4 rounded-2xl border-4 flex justify-between items-center ${isCurrent ? 'border-blue-500 shadow-sm bg-blue-50' : 'border-gray-300'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{t.icon}</span>
                      <div>
                        <p className="font-bold text-lg text-gray-800">{t.name}</p>
                        <p className="text-sm font-bold text-gray-500">{t.desc}</p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span className="font-black text-blue-500 px-4 whitespace-nowrap min-w-[90px] text-center">적용중</span>
                    ) : isOwned ? (
                      <button onClick={() => setTheme(t.id)} className="bg-blue-500 hover:bg-blue-400 text-white font-black px-4 py-2 rounded-xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-[90px]">적용하기</button>
                    ) : (
                      <button onClick={() => handleBuyTheme(t.id, t.price)} className="bg-yellow-400 hover:bg-yellow-300 font-black px-4 py-2 rounded-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-[90px]">{t.price} P</button>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;