import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';

const CreateFarm = () => {
  const [fName, setFName] = useState('');
  const [uName, setUName] = useState('');
  const createFarm = useUserStore((state) => state.createFarm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fName.trim() && uName.trim()) {
      createFarm(fName, uName);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-linear-to-br from-green-300 to-green-500 p-4 relative overflow-hidden">
      {/* 장식용 구름과 꽃 (화면이 작아져도 방해되지 않도록 위치와 크기 조정) */}
      <div className="absolute top-8 left-8 text-4xl opacity-70">☁️</div>
      <div className="absolute top-16 right-10 text-5xl opacity-60">☁️</div>
      <div className="absolute bottom-4 left-6 text-5xl opacity-90">🌻</div>
      <div className="absolute bottom-6 right-6 text-4xl opacity-90">🌷</div>

      {/* 타이틀 영역 (크기와 여백을 줄임) */}
      <div className="z-10 mb-4 transform -rotate-2 mt-2">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] border-4 border-green-900 bg-green-700 px-6 py-2 rounded-2xl whitespace-nowrap">
          🐾 웰컴 투 동물농장
        </h1>
      </div>
      
      {/* 입력 폼 영역 (내부 여백과 폰트 크기 최적화) */}
      <form onSubmit={handleSubmit} className="z-10 bg-orange-50 p-6 rounded-4xl border-[6px] border-orange-800 w-full max-w-sm shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-bold text-orange-900 mb-1 drop-shadow-sm">농장 이름</label>
            <input 
              type="text"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              placeholder="예: 초록마을"
              className="w-full px-3 py-2 text-base font-bold text-gray-800 rounded-xl border-4 border-orange-300 focus:border-orange-600 outline-none bg-white shadow-inner placeholder-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-lg font-bold text-orange-900 mb-1 drop-shadow-sm">농장주 이름</label>
            <input 
              type="text"
              value={uName}
              onChange={(e) => setUName(e.target.value)}
              placeholder="당신의 이름은?"
              className="w-full px-3 py-2 text-base font-bold text-gray-800 rounded-xl border-4 border-orange-300 focus:border-orange-600 outline-none bg-white shadow-inner placeholder-gray-400"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-extrabold py-3 rounded-xl text-xl shadow-[0_6px_0_#a16207] hover:translate-y-0.5 hover:shadow-[0_4px_0_#a16207] active:shadow-none active:translate-y-1.5 transition-all border-4 border-yellow-800"
          >
            게임 시작하기!
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFarm;