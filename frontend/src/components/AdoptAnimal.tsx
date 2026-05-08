import { useState } from 'react';
import { useAnimalStore, type Species } from '../store/useAnimalStore';

const ANIMAL_OPTIONS: { species: Species; emoji: string; desc: string }[] = [
  { species: 'Dog', emoji: '🐶', desc: '활발한 멍멍이' },
  { species: 'Cat', emoji: '🐱', desc: '도도한 야옹이' },
  { species: 'Chick', emoji: '🐥', desc: '귀여운 삐약이' },
];

const AdoptAnimal = () => {
  const adoptAnimal = useAnimalStore((state) => state.adoptAnimal);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [animalName, setAnimalName] = useState('');

  const handleAdopt = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSpecies && animalName.trim()) {
      adoptAnimal(animalName, selectedSpecies);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange-200 to-orange-400 p-4 md:p-8 relative">
      <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-[6px] border-orange-800 shadow-[10px_10px_0_rgba(0,0,0,0.2)] w-full max-w-2xl text-center z-10 flex flex-col items-center">
        
        <h2 className="text-2xl md:text-4xl font-extrabold text-orange-900 mb-2">
          🎁 첫 동물을 선택하세요!
        </h2>
        <p className="text-base md:text-lg font-bold text-orange-700 mb-6">어떤 친구와 함께 농장을 꾸려갈까요?</p>

        <form onSubmit={handleAdopt} className="w-full">
          {/* 캐릭터 선택 카드들 */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
            {ANIMAL_OPTIONS.map((animal) => (
              <div
                key={animal.species}
                onClick={() => setSelectedSpecies(animal.species)}
                className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-4 transition-all duration-200 ${
                  selectedSpecies === animal.species
                    ? 'border-orange-600 bg-orange-100 scale-105 shadow-[0_0_20px_rgba(234,88,12,0.5)]'
                    : 'border-gray-300 bg-gray-100 hover:bg-orange-50 hover:border-orange-400'
                }`}
              >
                <span className="text-5xl md:text-7xl mb-2 drop-shadow-md">{animal.emoji}</span>
                <span className="font-extrabold text-gray-800 text-lg">{animal.species}</span>
                <span className="text-xs font-bold text-gray-500 mt-1">{animal.desc}</span>
              </div>
            ))}
          </div>

          {/* 이름 입력 영역 */}
          <div className={`transition-all duration-300 overflow-hidden ${selectedSpecies ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
            <div className="flex flex-col items-center bg-orange-50 p-5 rounded-2xl border-4 border-orange-200">
              <label className="text-lg font-bold text-orange-900 mb-2">동물의 이름은?</label>
              <input
                type="text"
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
                placeholder="이름을 지어주세요"
                className="w-full max-w-sm px-4 py-2 text-center text-lg font-bold rounded-xl border-4 border-orange-300 focus:border-orange-600 outline-none mb-4 shadow-inner"
              />
              <button
                type="submit"
                disabled={!animalName.trim()}
                className="w-full max-w-sm bg-green-500 hover:bg-green-400 text-white font-extrabold py-3 rounded-xl text-xl shadow-[0_6px_0_#166534] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all border-4 border-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                입양 완료!
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdoptAnimal;