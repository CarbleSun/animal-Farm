import { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

interface MiniGameModalProps {
  onClose: () => void;
}

interface Weed {
  id: number;
  x: number;
  y: number;
}

const MiniGameModal = ({ onClose }: MiniGameModalProps) => {
  const earnPoints = useUserStore((state) => state.earnPoints);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10초 제한 시간
  const [score, setScore] = useState(0);
  const [weeds, setWeeds] = useState<Weed[]>([]);

  // 게임 시작 함수
  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(10);
    setScore(0);
    setWeeds([]);
  };

  // 타이머 및 잡초 생성 루프
  useEffect(() => {
    if (!isPlaying) return;

    // 1초마다 시간 감소
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          // 게임 종료 시 점수만큼 포인트 지급 (1점 = 10 P)
          const earned = score * 10;
          if (earned > 0) earnPoints(earned);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 0.6초마다 새로운 잡초 생성
    const spawner = setInterval(() => {
      const newWeed: Weed = {
        id: Date.now(),
        x: Math.floor(Math.random() * 80) + 10, // 10% ~ 90% 위치
        y: Math.floor(Math.random() * 70) + 10, // 10% ~ 80% 위치
      };
      setWeeds((prev) => [...prev, newWeed]);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [isPlaying, score, earnPoints]);

  // 잡초 클릭 시 점수 획득 및 잡초 제거
  const handleCatchWeed = (id: number) => {
    if (!isPlaying) return;
    setScore((prev) => prev + 1);
    setWeeds((prev) => prev.filter((weed) => weed.id !== id));
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-amber-100 w-full max-w-2xl h-96 rounded-[2rem] border-8 border-amber-800 shadow-2xl relative overflow-hidden flex flex-col cursor-crosshair">
        
        {/* 상단 UI */}
        <div className="bg-amber-800 text-white p-4 flex justify-between items-center z-10 border-b-4 border-amber-900">
          <span className="text-xl font-bold">🌱 잡초 뽑기 알바</span>
          <div className="flex gap-6 text-xl font-bold">
            <span className={timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}>
              ⏳ {timeLeft}초
            </span>
            <span className="text-green-300">🎯 {score}점</span>
          </div>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded-xl border-2 border-red-900">
            종료
          </button>
        </div>

        {/* 게임 영역 (잡초가 나타나는 밭) */}
        <div className="flex-1 relative bg-green-500/20">
          {!isPlaying && timeLeft === 10 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-20">
              <p className="text-2xl font-bold text-white mb-4 drop-shadow-md">밭에 난 잡초를 빠르게 클릭하세요!</p>
              <button 
                onClick={startGame}
                className="bg-yellow-400 text-yellow-900 text-2xl font-bold px-8 py-4 rounded-2xl border-4 border-yellow-700 hover:scale-105 active:scale-95 transition-transform"
              >
                알바 시작하기
              </button>
            </div>
          )}

          {!isPlaying && timeLeft === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
              <p className="text-4xl font-bold text-white mb-2">알바 끝!</p>
              <p className="text-2xl font-bold text-yellow-300 mb-6 drop-shadow-md">수당: {score * 10} P 획득!</p>
              <button 
                onClick={startGame}
                className="bg-blue-400 text-white text-xl font-bold px-6 py-3 rounded-2xl border-4 border-blue-800 hover:scale-105 active:scale-95 transition-transform"
              >
                다시 하기
              </button>
            </div>
          )}

          {/* 잡초 렌더링 */}
          {weeds.map((weed) => (
            <div
              key={weed.id}
              onClick={() => handleCatchWeed(weed.id)}
              className="absolute text-5xl hover:scale-125 transition-transform drop-shadow-lg animate-bounce"
              style={{ left: `${weed.x}%`, top: `${weed.y}%` }}
            >
              🌱
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniGameModal;