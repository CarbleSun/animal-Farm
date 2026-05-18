import React, { useState } from 'react';
import { useAnimalStore } from '../store/useAnimalStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { useGameActions, type ActionFeedback } from '../hooks/useGameActions';
import { useAlertStore } from '../store/useAlertStore';
import { useUserStore } from '../store/useUserStore';
import AnimalHospitalModal from './AnimalHospitalModal';

interface FeedbackText { id: number; text: string; x: number; y: number; color: string; }

interface AnimalDetailViewProps {
  animalId: string;
  onGraduated: () => void;
}

const AnimalDetailView = ({ animalId, onGraduated }: AnimalDetailViewProps) => {
  const { animals, graduateAnimal } = useAnimalStore();
  const { addGraduatedCount } = useUserStore();
  const inventory = useInventoryStore();
  const { feedAnimal, playWithAnimal } = useGameActions();
  const { showConfirm, showAlert } = useAlertStore();
  const [feedbackTexts, setFeedbackTexts] = useState<FeedbackText[]>([]);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  const myAnimal = animals.find(a => a.id === animalId);
  if (!myAnimal) return null;

  const getEvolutionStage = (affection: number) => {
    if (affection >= 100) return '성체 (3단계)';
    if (affection >= 50) return '성장기 (2단계)';
    return '유년기 (1단계)';
  };

  const getAnimalEmoji = (species: string, affection: number) => {
    if (species === 'Dog') return affection >= 100 ? '🐺' : affection >= 50 ? '🐕' : '🐶';
    if (species === 'Cat') return affection >= 100 ? '🐅' : affection >= 50 ? '🐈' : '🐱';
    if (species === 'Chick') return affection >= 100 ? '🐔' : affection >= 50 ? '🐥' : '🐣';
    return '❓';
  };

  const handleGraduation = () => {
    showConfirm(
      `${myAnimal.name}이(가) 애정지수가 가득 차\n독립할 준비가 되었습니다!\n\n엔딩을 보시겠습니까?\n(되돌릴 수 없습니다)`,
      () => {
        addGraduatedCount();
        graduateAnimal(myAnimal.id);
        showAlert('동물이 훌륭하게 자라 농장을 떠났습니다.\n계급 점수가 올랐습니다!');
        onGraduated();
      }
    );
  };

  const handleAction = (actionFn: () => ActionFeedback | null, e: React.MouseEvent<HTMLButtonElement>) => {
    const result = actionFn();
    if (!result) return;
    const { clientX, clientY } = e;
    const offset = feedbackTexts.length * 20;
    const newFeedbacks: FeedbackText[] = [];
    const createFB = (text: string, color: string, yOff: number) => ({ id: Date.now() + yOff, text, x: clientX, y: clientY - 30 + yOff - offset, color });
    
    if (result.stats.hunger) newFeedbacks.push(createFB(`🍖 +${result.stats.hunger}`, 'text-orange-600', 0));
    if (result.stats.happiness) newFeedbacks.push(createFB(`❤️ +${result.stats.happiness}`, 'text-pink-600', -25));
    if (result.stats.affection) newFeedbacks.push(createFB(`💖 +${result.stats.affection}`, 'text-pink-500', -50));
    
    setFeedbackTexts((prev) => [...prev, ...newFeedbacks]);
    setTimeout(() => { setFeedbackTexts((prev) => prev.filter((fb) => !newFeedbacks.some(n => n.id === fb.id))); }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-gradient-linear-b from-sky-200 to-sky-100 relative items-center">
      
      {/* 배경 요소를 최상위 래퍼로 분리하여 화면 전체 폭을 덮게 수정 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-10 left-10 text-white/80 text-4xl">☁️</div>
         <div className="absolute top-20 right-16 text-white/70 text-3xl">☁️</div>
         <div className="absolute top-28 left-1/4 text-white/60 text-2xl animate-pulse">✨</div>
         <div className="absolute top-16 right-1/3 text-white/60 text-xl animate-pulse">✨</div>
         
         {/* 언덕이 중앙 영역에 갇히지 않고 화면 전체를 채우도록 width 확대 및 위치 조정 */}
         <div className="absolute bottom-0 left-[-10%] w-[120%] h-[40%] bg-[#a3d130] rounded-t-[100%] border-t-8 border-[#8cba22]"></div>
      </div>

      {/* 콘텐츠 영역 (가운데 정렬) */}
      <div className="flex-1 w-full max-w-5xl relative flex flex-col items-center justify-center p-6 z-10">
         
         <div className="absolute top-8 z-20 bg-white/90 backdrop-blur px-6 py-2 rounded-full border-4 border-sky-300 shadow-sm font-black text-sky-800 text-lg tracking-wider">
           {myAnimal.name}의 공간
         </div>

         {feedbackTexts.map((fb) => (
            <div key={fb.id} className={`fixed font-extrabold text-xl animate-floating-text z-9999 pointer-events-none drop-shadow-md ${fb.color}`} style={{ left: fb.x, top: fb.y }}>
              {fb.text}
            </div>
          ))}
          
         {myAnimal.isSick && <div className="absolute inset-0 bg-purple-900/10 z-0 animate-pulse mix-blend-multiply"></div>}

         {(myAnimal.affection || 0) >= 100 && (
            <button onClick={handleGraduation} className="absolute top-20 z-30 bg-yellow-400 text-yellow-900 px-5 py-2.5 rounded-full font-black text-lg border-4 border-yellow-600 shadow-[0_4px_0_#ca8a04] hover:bg-yellow-300 hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all animate-bounce">
              🎓 독립시키기 (엔딩)
            </button>
          )}

         {myAnimal.isSick && <div className="absolute top-24 text-5xl animate-bounce z-30">🤒</div>}

         <div className="absolute top-[60%] mt-8 w-40 md:w-48 h-6 bg-black/15 rounded-[100%] blur-sm z-10"></div>

         <div className={`text-[7rem] md:text-[9rem] drop-shadow-2xl z-20 relative -mt-4 transition-transform duration-300 ${myAnimal.isSick ? 'opacity-70 rotate-6' : myAnimal.hunger < 30 ? 'animate-bounce' : 'hover:-translate-y-4'}`}>
            {getAnimalEmoji(myAnimal.species, myAnimal.affection || 0)}
         </div>

         <div className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
            <button onClick={(e) => handleAction(feedAnimal, e)} disabled={myAnimal.hunger >= 100 || inventory.food <= 0} className="relative group flex flex-col items-center justify-center bg-orange-400 hover:bg-orange-300 text-white w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-[0_4px_0_#9a3412] border-4 border-orange-900 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
              <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-[10px]">{inventory.food}</span>
              <span className="text-3xl md:text-4xl mb-0.5 group-active:scale-90 transition-transform">🍖</span><span className="text-[10px] md:text-xs font-extrabold text-orange-900">밥주기</span>
            </button>
            <button onClick={(e) => handleAction(playWithAnimal, e)} disabled={myAnimal.happiness >= 100 || inventory.toy <= 0 || myAnimal.isSick} className="relative group flex flex-col items-center justify-center bg-pink-400 hover:bg-pink-300 text-white w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-[0_4px_0_#831843] border-4 border-pink-900 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
              <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white font-bold px-2 py-0.5 rounded-full border-2 border-white text-[10px]">{inventory.toy}</span>
              <span className="text-3xl md:text-4xl mb-0.5 group-active:scale-90 transition-transform">🎾</span><span className="text-[10px] md:text-xs font-extrabold text-pink-900">놀아주기</span>
            </button>
         </div>
         
         <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
            <button onClick={() => setIsHospitalOpen(true)} className={`relative group flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl transition-all border-4 ${myAnimal.isSick ? 'bg-red-500 hover:bg-red-400 border-red-900 shadow-[0_4px_0_#7f1d1d] animate-pulse active:translate-y-1' : 'bg-gray-300 hover:bg-gray-200 border-gray-600 shadow-[0_4px_0_#4b5563] active:translate-y-1'}`}>
              <span className="text-3xl md:text-4xl mb-0.5 group-active:scale-90 transition-transform">🏥</span><span className={`text-[10px] md:text-xs font-extrabold ${myAnimal.isSick ? 'text-white' : 'text-gray-600'}`}>병원</span>
            </button>
         </div>
      </div>

      {/* 하단 동물 프로필 대시보드 */}
      <div className="bg-white px-8 py-6 w-full border-t-8 border-[#8cba22] flex justify-center shrink-0 relative z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-1/3 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-gray-100 pb-4 md:pb-0 md:pr-6">
            <h3 className={`text-3xl md:text-4xl font-black mb-3 tracking-tight ${myAnimal.isSick ? 'text-red-600' : 'text-gray-800'}`}>
              {myAnimal.name}
            </h3>
            <span className="border-2 border-purple-400 text-purple-600 font-extrabold px-3 py-1 rounded-full text-xs w-fit mb-2">
              {getEvolutionStage(myAnimal.affection || 0)}
            </span>
            <p className="text-[11px] font-bold text-gray-400 tracking-wide">속성: 일반 동물</p>
          </div>
          
          <div className="w-full md:w-2/3 flex flex-col justify-center space-y-4">
            <div className="w-full">
              <div className="flex justify-between items-center text-xs font-black mb-1.5">
                <span className="text-pink-500">💖 애정지수</span>
                <span className="text-pink-500">{myAnimal.affection || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-pink-400 transition-all duration-300 rounded-full" style={{ width: `${myAnimal.affection || 0}%` }}></div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center text-xs font-black mb-1.5">
                <span className="text-orange-600">🍖 건강지수 (포만감)</span>
                <span className="text-orange-600">{myAnimal.hunger}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className={`h-full transition-all duration-500 rounded-full ${myAnimal.hunger < 30 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${myAnimal.hunger}%` }}></div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center text-xs font-black mb-1.5">
                <span className="text-yellow-600">❤️ 매력지수 (행복도)</span>
                <span className="text-yellow-600">{myAnimal.happiness}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-yellow-400 transition-all duration-500 rounded-full" style={{ width: `${myAnimal.happiness}%` }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {isHospitalOpen && <AnimalHospitalModal onClose={() => setIsHospitalOpen(false)} />}
    </div>
  );
};
export default AnimalDetailView;