import { useState } from 'react';
import { useAnimalStore, type Species } from '../store/useAnimalStore';

// Props 인터페이스 정의: onFinish를 선택적(optional)으로 추가
interface AdoptAnimalProps {
  onFinish?: () => void;
}

const AdoptAnimal = ({ onFinish }: AdoptAnimalProps) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('Dog');
  const adoptAnimal = useAnimalStore((state) => state.adoptAnimal);

  const handleAdopt = () => {
    if (!name.trim()) {
      alert('동물의 이름을 지어주세요!');
      return;
    }
    adoptAnimal(name, species);
    
    // 입양이 완료되면 부모 컴포넌트(FarmMain)에게 알림
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-sky-300 p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] border-8 border-sky-800 shadow-[12px_12px_0_rgba(0,0,0,0.2)] p-8 flex flex-col items-center">
        <h1 className="text-3xl font-black text-sky-900 mb-8 tracking-tighter">새로운 식구 입양하기</h1>
        
        {/* 이름 입력 */}
        <div className="w-full mb-8">
          <label className="block text-sm font-bold text-sky-700 mb-2 ml-2">이름 정하기</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-6 py-4 rounded-2xl border-4 border-sky-100 focus:border-sky-400 outline-none text-xl font-bold transition-all shadow-inner"
          />
        </div>

        {/* 종류 선택 */}
        <div className="w-full mb-10">
          <label className="block text-sm font-bold text-sky-700 mb-2 ml-2">종류 선택</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Dog', 'Cat', 'Chick'] as Species[]).map((s) => (
              <button
                key={s}
                onClick={() => setSpecies(s)}
                className={`flex flex-col items-center p-4 rounded-2xl border-4 transition-all ${
                  species === s 
                  ? 'bg-sky-100 border-sky-500 scale-105 shadow-md' 
                  : 'bg-gray-50 border-gray-200 hover:border-sky-200'
                }`}
              >
                <span className="text-4xl mb-2">
                  {s === 'Dog' ? '🐶' : s === 'Cat' ? '🐱' : '🐥'}
                </span>
                <span className="font-bold text-gray-700">{s === 'Dog' ? '강아지' : s === 'Cat' ? '고양이' : '병아리'}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdopt}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-2xl font-black py-5 rounded-3xl border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
        >
          입양 완료!
        </button>
      </div>
    </div>
  );
};

export default AdoptAnimal;