// src/components/CreateFarm.tsx
import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const CreateFarm = () => {
  const [fName, setFName] = useState('');
  const [uName, setUName] = useState('');
  const createFarm = useGameStore((state) => state.createFarm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fName.trim() && uName.trim()) {
      createFarm(fName, uName);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-300 to-green-500 p-8 relative overflow-hidden">
      {/* 장식용 구름과 꽃 */}
      <div className="absolute top-10 left-10 text-6xl opacity-70">☁️</div>
      <div className="absolute top-24 right-16 text-5xl opacity-60">☁️</div>
      <div className="absolute bottom-5 left-10 text-7xl opacity-90">🌻</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-90">🌷</div>

      {/* 타이틀 영역 */}
      <div className="z-10 mb-8 transform -rotate-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] border-4 border-green-900 bg-green-700 px-8 py-4 rounded-3xl">
          🐾 웰컴 투 동물농장
        </h1>
      </div>
      
      {/* 입력 폼 영역 */}
      <form onSubmit={handleSubmit} className="z-10 bg-orange-50 p-8 rounded-[2rem] border-[6px] border-orange-800 w-full max-w-md shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
        <div className="space-y-6">
          <div>
            <label className="block text-xl font-bold text-orange-900 mb-2 drop-shadow-sm">농장 이름</label>
            <input 
              type="text"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              placeholder="예: 초록마을"
              className="w-full px-4 py-3 text-lg font-bold text-gray-800 rounded-xl border-4 border-orange-300 focus:border-orange-600 outline-none bg-white shadow-inner placeholder-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-xl font-bold text-orange-900 mb-2 drop-shadow-sm">농장주 이름</label>
            <input 
              type="text"
              value={uName}
              onChange={(e) => setUName(e.target.value)}
              placeholder="당신의 이름은?"
              className="w-full px-4 py-3 text-lg font-bold text-gray-800 rounded-xl border-4 border-orange-300 focus:border-orange-600 outline-none bg-white shadow-inner placeholder-gray-400"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-extrabold py-4 rounded-xl text-2xl shadow-[0_8px_0_#a16207] hover:translate-y-[2px] hover:shadow-[0_6px_0_#a16207] active:shadow-none active:translate-y-[8px] transition-all border-4 border-yellow-800"
          >
            게임 시작하기!
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFarm;