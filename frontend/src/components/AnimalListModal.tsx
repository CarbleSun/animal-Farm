import { useAnimalStore } from '../store/useAnimalStore';

interface AnimalListModalProps {
  onClose: () => void;
  onAdoptNew: () => void;
}

const AnimalListModal = ({ onClose, onAdoptNew }: AnimalListModalProps) => {
  const { animals, activeAnimalId, setActiveAnimal } = useAnimalStore();

  const getEmoji = (species: string, level: number) => {
    if (species === 'Dog') return level >= 3 ? '🐺' : level >= 2 ? '🐕' : '🐶';
    if (species === 'Cat') return level >= 3 ? '🐅' : level >= 2 ? '🐈' : '🐱';
    if (species === 'Chick') return level >= 3 ? '🐔' : level >= 2 ? '🐥' : '🐣';
    return '❓';
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* 👇 max-h-[85vh]를 max-h-[90%]로 변경하여 게임 화면 내부로 높이를 엄격하게 제한 */}
      <div className="bg-sky-50 w-full max-w-120 rounded-4xl border-8 border-sky-800 shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col max-h-[90%] min-h-87.5">
        
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-red-500 text-white w-11 h-11 rounded-full border-4 border-red-900 font-extrabold text-xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-0.5 active:translate-y-1">X</button>

        <h2 className="text-3xl font-extrabold text-sky-900 mb-5 text-center border-b-4 border-sky-200 pb-4">🐾 우리집 동물들</h2>

        {/* 👇 flex-1과 overflow-y-auto가 부모의 max-h 안에서 정상적으로 스크롤을 생성함 */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {animals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => { setActiveAnimal(animal.id); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-4 transition-all ${
                animal.id === activeAnimalId 
                ? 'bg-white border-yellow-400 shadow-[4px_4px_0_#ca8a04]' 
                : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-sky-400'
              }`}
            >
              <span className="text-[2.5rem] leading-none">{getEmoji(animal.species, animal.level)}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-yellow-400 text-yellow-900 text-[11px] font-black px-2 py-0.5 rounded-lg border border-yellow-600">Lv.{animal.level}</span>
                  <span className="font-bold text-gray-800 text-base">{animal.name}</span>
                  {animal.isSick && <span className="text-xs animate-pulse">🤒</span>}
                </div>
                <div className="flex gap-2 mt-1">
                   <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden border border-gray-300">
                      <div className="bg-orange-400 h-full" style={{ width: `${animal.hunger}%` }}></div>
                   </div>
                   <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden border border-gray-300">
                      <div className="bg-pink-400 h-full" style={{ width: `${animal.happiness}%` }}></div>
                   </div>
                </div>
              </div>
              {animal.id === activeAnimalId && <span className="text-blue-500 font-black text-sm">선택됨</span>}
            </button>
          ))}
        </div>

        <button 
          onClick={onAdoptNew}
          className="mt-5 w-full shrink-0 bg-green-500 text-white py-3.5 rounded-xl font-black text-xl border-b-8 border-green-800 hover:bg-green-400 active:border-b-0 active:translate-y-2 transition-all"
        >
          ➕ 새 식구 입양하기
        </button>
      </div>
    </div>
  );
};

export default AnimalListModal;