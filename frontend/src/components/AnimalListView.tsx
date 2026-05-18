import { useAnimalStore } from '../store/useAnimalStore';
import { useUserStore, getRankInfo } from '../store/useUserStore';

interface AnimalListViewProps {
  onAdoptNew: () => void;
  onOpenDetail: (id: string) => void;
}

const AnimalListView = ({ onAdoptNew, onOpenDetail }: AnimalListViewProps) => {
  const { animals, setActiveAnimal } = useAnimalStore();
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
    if (affection >= 100) return '3단계';
    if (affection >= 50) return '2단계';
    return '1단계';
  };

  return (
    <div className="w-full h-full bg-[#f2fcd0] flex flex-col p-4 md:p-8 overflow-hidden">
      
      {/* 헤더 영역: 돌아가기 버튼 완벽 제거 및 센터 배치 */}
      <div className="flex items-center justify-center mb-6 border-b-4 border-lime-400 pb-4 shrink-0">
        <h2 className="text-3xl font-extrabold text-lime-900 text-center py-1">🐾 동물 관리</h2>
      </div>

      {/* 정사각형 카드 그리드 레이아웃 */}
      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 custom-scrollbar content-start pb-4">
        {animals.map((animal) => (
          <button 
            key={animal.id} 
            onClick={() => { setActiveAnimal(animal.id); onOpenDetail(animal.id); }} 
            className="aspect-square w-full flex flex-col items-center justify-between p-3.5 rounded-2xl border-4 bg-white border-lime-300 hover:bg-lime-50 hover:border-lime-500 shadow-sm transition-all relative group"
          >
            <div className="w-full flex justify-between items-center shrink-0">
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-purple-300">
                {getEvolutionStage(animal.affection || 0)}
              </span>
              {animal.isSick && <span className="text-xs animate-pulse">🤒</span>}
            </div>

            <span className="text-5xl md:text-6xl my-1 group-hover:scale-110 transition-transform leading-none">
              {getEmoji(animal.species, animal.affection || 0)}
            </span>

            <span className="font-black text-gray-800 text-sm truncate w-full text-center leading-tight mb-1">
              {animal.name}
            </span>

            <div className="w-full space-y-1 text-[10px] shrink-0">
              <div className="flex items-center gap-1">
                <span className="w-3 text-center">💖</span>
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden border border-gray-200">
                  <div className="bg-pink-400 h-full" style={{ width: `${animal.affection || 0}%` }}></div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 text-center">🍖</span>
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden border border-gray-200">
                  <div className="bg-orange-400 h-full" style={{ width: `${animal.hunger || 0}%` }}></div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 text-center">❤️</span>
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden border border-gray-200">
                  <div className="bg-yellow-400 h-full" style={{ width: `${animal.happiness || 0}%` }}></div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button onClick={onAdoptNew} disabled={isFull} className={`mt-5 w-full shrink-0 py-3.5 rounded-xl font-black text-xl border-b-8 transition-all ${isFull ? 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed' : 'bg-green-500 text-white border-green-800 hover:bg-green-400 active:border-b-0 active:translate-y-2'}`}>
        {isFull ? `사육장 꽉 참 (${animals.length}/${maxCapacity})` : `➕ 새 식구 입양 (${animals.length}/${maxCapacity})`}
      </button>
    </div>
  );
};

export default AnimalListView;