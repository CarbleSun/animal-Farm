import { useUserStore } from '../store/useUserStore';
import { useAnimalStore } from '../store/useAnimalStore';

interface AnimalHospitalModalProps {
  onClose: () => void;
}

const AnimalHospitalModal = ({ onClose }: AnimalHospitalModalProps) => {
  const { spendPoints, points } = useUserStore();
  const { animals, activeAnimalId, cureDisease } = useAnimalStore();
  
  const myAnimal = animals.find(a => a.id === activeAnimalId);

  const handleCure = () => {
    if (!myAnimal?.isSick) {
      alert('현재 아주 건강한 상태입니다!');
      return;
    }
    
    if (spendPoints(500)) {
      cureDisease();
      alert(`${myAnimal.name}의 병이 완치되었습니다! (호감도 +10)`);
      onClose();
    } else {
      alert('치료비(포인트)가 부족합니다.');
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-red-50 w-full max-w-sm rounded-[2rem] border-8 border-red-800 shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col items-center">
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-gray-500 text-white w-11 h-11 rounded-full border-4 border-gray-900 font-extrabold text-xl shadow-[0_4px_0_#374151] hover:translate-y-[2px] active:translate-y-[4px]">X</button>
        
        <h2 className="text-3xl font-extrabold text-red-900 mb-6 border-b-4 border-red-200 pb-3 w-full text-center">🏥 동물 병원</h2>

        <div className="text-6xl mb-4 bg-white p-6 rounded-full border-4 border-gray-300 shadow-inner">
          👨‍⚕️
        </div>

        <div className="w-full bg-white rounded-2xl border-4 border-gray-300 p-5 mb-6 text-center shadow-sm">
          {myAnimal?.isSick ? (
            <>
              <p className="font-extrabold text-red-600 text-lg mb-2">"{myAnimal.name}이(가) 많이 아프군요!"</p>
              <p className="font-bold text-gray-600 text-sm">전문가의 치료가 필요합니다.</p>
              <div className="mt-4 bg-red-100 text-red-800 font-black py-2 rounded-xl border-2 border-red-300">
                치료비: 500 P
              </div>
            </>
          ) : (
            <>
              <p className="font-extrabold text-green-600 text-lg mb-2">"{myAnimal?.name}은(는) 건강합니다!"</p>
              <p className="font-bold text-gray-600 text-sm">지금은 치료가 필요하지 않아요.</p>
            </>
          )}
        </div>

        {myAnimal?.isSick ? (
          <button 
            onClick={handleCure}
            className="w-full bg-red-500 text-white font-black text-xl py-3 rounded-xl border-b-8 border-red-800 hover:bg-red-400 active:border-b-0 active:translate-y-2 transition-all"
          >
            치료하기
          </button>
        ) : (
          <button 
            onClick={onClose}
            className="w-full bg-gray-400 text-white font-black text-xl py-3 rounded-xl border-b-8 border-gray-600 hover:bg-gray-300 active:border-b-0 active:translate-y-2 transition-all"
          >
            돌아가기
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimalHospitalModal;