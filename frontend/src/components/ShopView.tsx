import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useUserStore, type ThemeType } from '../store/useUserStore';
import { useAlertStore } from '../store/useAlertStore';

const THEMES: { id: ThemeType; name: string; price: number; icon: string; desc: string }[] = [
  { id: 'night', name: '고요한 밤', price: 3000, icon: '🌙', desc: '별이 빛나는 밤하늘' },
  { id: 'sunset', name: '노을 지는 저녁', price: 4000, icon: '🌅', desc: '따뜻한 노을빛' },
  { id: 'beach', name: '여름 해변', price: 5000, icon: '🌊', desc: '시원한 바닷가' },
];

const ShopView = () => {
  const { points, spendPoints, currentTheme, ownedThemes, buyTheme, setTheme } = useUserStore();
  const addItem = useInventoryStore((state) => state.addItem);
  const showAlert = useAlertStore((state) => state.showAlert);
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
    <div className="w-full h-full bg-blue-50 flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="flex items-center justify-center mb-6 border-b-4 border-blue-200 pb-4 shrink-0">
        <h2 className="text-3xl font-extrabold text-blue-900 text-center py-1">🏪 만물상</h2>
      </div>
      
      <div className="flex mb-6 bg-blue-200 rounded-xl p-1 border-2 border-blue-300 shrink-0 max-w-lg mx-auto w-full">
        <button onClick={() => setTab('item')} className={`flex-1 py-3 font-bold rounded-lg transition-all ${tab === 'item' ? 'bg-white shadow-sm text-blue-800' : 'text-blue-600 hover:bg-blue-100'}`}>소모품</button>
        <button onClick={() => setTab('deco')} className={`flex-1 py-3 font-bold rounded-lg transition-all ${tab === 'deco' ? 'bg-white shadow-sm text-blue-800' : 'text-blue-600 hover:bg-blue-100'}`}>농장 꾸미기</button>
      </div>

      <div className="bg-yellow-300 text-yellow-900 font-black py-3 px-6 rounded-xl border-4 border-yellow-600 self-center mb-6 shrink-0 shadow-sm">
        내 지갑: {points.toLocaleString()} P
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-w-3xl mx-auto w-full">
        {tab === 'item' ? (
          <>
            <div className="bg-white p-5 rounded-2xl border-4 border-gray-300 flex justify-between items-center shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-5">
                <span className="text-5xl">🍖</span>
                <div>
                  <p className="font-bold text-xl text-gray-800">사료 (5개)</p>
                  <p className="text-sm font-bold text-gray-500">포만감을 채워줍니다.</p>
                </div>
              </div>
              <button onClick={() => handleBuyItem('food', 200, 5)} className="bg-yellow-400 hover:bg-yellow-300 font-black px-6 py-3 rounded-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-25 text-lg">200 P</button>
            </div>
            <div className="bg-white p-5 rounded-2xl border-4 border-gray-300 flex justify-between items-center shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-5">
                <span className="text-5xl">🎾</span>
                <div>
                  <p className="font-bold text-xl text-gray-800">장난감 (3개)</p>
                  <p className="text-sm font-bold text-gray-500">행복도를 올려줍니다.</p>
                </div>
              </div>
              <button onClick={() => handleBuyItem('toy', 300, 3)} className="bg-yellow-400 hover:bg-yellow-300 font-black px-6 py-3 rounded-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-25 text-lg">300 P</button>
            </div>
          </>
        ) : (
          <>
            {THEMES.map((t) => {
              const isOwned = ownedThemes?.includes(t.id);
              const isCurrent = currentTheme === t.id;
              return (
                <div key={t.id} className={`bg-white p-5 rounded-2xl border-4 flex justify-between items-center shadow-sm transition-colors ${isCurrent ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}>
                  <div className="flex items-center gap-5">
                    <span className="text-5xl">{t.icon}</span>
                    <div>
                      <p className="font-bold text-xl text-gray-800">{t.name}</p>
                      <p className="text-sm font-bold text-gray-500">{t.desc}</p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="font-black text-blue-500 px-6 whitespace-nowrap min-w-25 text-center text-lg">적용중</span>
                  ) : isOwned ? (
                    <button onClick={() => setTheme(t.id)} className="bg-blue-500 hover:bg-blue-400 text-white font-black px-6 py-3 rounded-xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-25 text-lg">적용하기</button>
                  ) : (
                    <button onClick={() => handleBuyTheme(t.id, t.price)} className="bg-yellow-400 hover:bg-yellow-300 font-black px-6 py-3 rounded-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 whitespace-nowrap min-w-25 text-lg">{t.price} P</button>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopView;