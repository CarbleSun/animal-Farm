import { useAnimalStore } from '../store/useAnimalStore';
import { useUserStore, getRankInfo } from '../store/useUserStore';

interface AnimalListModalProps {
  onClose: () => void;
  onAdoptNew: () => void;
}

const AnimalListModal = ({ onClose, onAdoptNew }: AnimalListModalProps) => {
  const { animals, activeAnimalId, setActiveAnimal } = useAnimalStore();
  const graduatedCount = useUserStore((state) => state.graduatedCount);
  
  const { maxCapacity } = getRankInfo(graduatedCount);
  const isFull = animals.length >= maxCapacity;

  const getEmoji = (species: string, affection: number) => {
    if (species === 'Dog') return affection >= 100 ? '🐺' : affection >= 50 ? '🐕' : '🐶';
    if (species === 'Cat') return affection >= 100 ? '🐅' : affection >= 50 ? '🐈' : '🐱';
    if (species === 'Chick') return affection >= 100 ? '🐔' : affection >= 50 ? '🐥' : '🐣';
    return '❓';
  };

  const getEvolutionStage = (affection: number) => {
    if (affection >= 100) return '성체 (3단계)';
    if (affection >= 50) return '성장기 (2단계)';
    return '유년기 (1단계)';
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-sky-50 w-full max-w-[480px] rounded-[2rem] border-8 border-sky-800 shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col max-h-[90%] min-h-[350px]">
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-red-500 text-white w-11 h-11 rounded-full border-4 border-red-900 font-extrabold text-xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-[2px] active:translate-y-[4px]">X</button>
        <h2 className="text-3xl font-extrabold text-sky-900 mb-5 text-center border-b-4 border-sky-200 pb-4">🐾 우리집 동물들</h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {animals.map((animal) => (
            <button key={animal.id} onClick={() => { setActiveAnimal(animal.id); onClose(); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-4 transition-all ${animal.id === activeAnimalId ? 'bg-white border-yellow-400 shadow-[4px_4px_0_#ca8a04]' : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-sky-400'}`}>
              <span className="text-[2.5rem] leading-none">{getEmoji(animal.species, animal.affection || 0)}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-800 text-lg">{animal.name}</span>
                  <span className="bg-purple-100 text-purple-700 text-[11px] font-black px-2 py-0.5 rounded-lg border border-purple-300">
                    {getEvolutionStage(animal.affection || 0)}
                  </span>
                  {animal.isSick && <span className="text-xs animate-pulse">🤒</span>}
                </div>
                <div className="w-full">
                   <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                     <span>💖 호감도</span>
                     <span className="text-pink-500">{animal.affection || 0}%</span>
                   </div>
                   <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-300">
                     <div className="bg-pink-400 h-full transition-all" style={{ width: `${animal.affection || 0}%` }}></div>
                   </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={onAdoptNew}
          disabled={isFull}
          className={`mt-5 w-full shrink-0 py-3.5 rounded-xl font-black text-xl border-b-8 transition-all ${isFull ? 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed' : 'bg-green-500 text-white border-green-800 hover:bg-green-400 active:border-b-0 active:translate-y-2'}`}
        >
          {isFull ? `사육장 꽉 참 (${animals.length}/${maxCapacity})` : `➕ 새 식구 입양 (${animals.length}/${maxCapacity})`}
        </button>
      </div>
    </div>
  );
};

export default AnimalListModal;