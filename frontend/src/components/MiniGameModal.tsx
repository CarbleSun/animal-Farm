import { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useAnimalStore } from '../store/useAnimalStore'; // 👈 동물 스토어 추가

interface MiniGameModalProps {
  onClose: () => void;
}

type GameMode = 'select' | 'apple' | 'weed' | 'spy' | 'sort';
type GameState = 'ready' | 'playing' | 'result';

const SPY_PAIRS = [
  ['🐑', '🐏'], ['🐥', '🐤'], ['🐶', '🐺'], ['🍀', '🌿'], ['🍎', '🍅'], ['🐮', '🐷']
];

const MiniGameModal = ({ onClose }: MiniGameModalProps) => {
  const addPoints = useUserStore((state) => state.addPoints);
  const updateStats = useAnimalStore((state) => state.updateStats); // 👈 체력 감소용 함수
  
  const [mode, setMode] = useState<GameMode>('select');
  const [gameState, setGameState] = useState<GameState>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [activeWeed, setActiveWeed] = useState<number | null>(null);
  const [spyData, setSpyData] = useState<{ grid: string[], answer: number }>({ grid: [], answer: 0 });
  const [sortItem, setSortItem] = useState<'🦴' | '🐟'>('🦴');

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('result');
      
      let rewardMultiplier = 10;
      if (mode === 'weed') rewardMultiplier = 20;
      if (mode === 'spy') rewardMultiplier = 30;
      if (mode === 'sort') rewardMultiplier = 5;
      
      addPoints(score * rewardMultiplier);
      
      // 👇 알바 종료 시 체력 페널티 적용 (포만감 -10, 행복도 -10)
      updateStats(-20, -20);
    }
  }, [timeLeft, gameState, score, mode, addPoints, updateStats]);

  useEffect(() => {
    let weedTimer: ReturnType<typeof setInterval>;
    if (mode === 'weed' && gameState === 'playing') {
      weedTimer = setInterval(() => setActiveWeed(Math.floor(Math.random() * 9)), 600);
    }
    return () => clearInterval(weedTimer);
  }, [mode, gameState]);

  const generateSpy = () => {
    const pair = SPY_PAIRS[Math.floor(Math.random() * SPY_PAIRS.length)];
    const answerIndex = Math.floor(Math.random() * 9);
    const grid = Array(9).fill(pair[0]);
    grid[answerIndex] = pair[1];
    setSpyData({ grid, answer: answerIndex });
  };

  const generateSort = () => {
    setSortItem(Math.random() > 0.5 ? '🦴' : '🐟');
  };

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setScore(0);
    setGameState('playing');
    
    if (selectedMode === 'apple') setTimeLeft(10);
    else if (selectedMode === 'weed') { setTimeLeft(15); setActiveWeed(null); }
    else if (selectedMode === 'spy') { setTimeLeft(15); generateSpy(); }
    else if (selectedMode === 'sort') { setTimeLeft(15); generateSort(); }
  };

  const handleAppleClick = () => {
    if (gameState === 'playing') setScore((prev) => prev + 1);
  };

  const handleWeedClick = (index: number) => {
    if (gameState === 'playing' && activeWeed === index) {
      setScore((prev) => prev + 1);
      setActiveWeed(null);
    }
  };

  const handleSpyClick = (index: number) => {
    if (gameState !== 'playing') return;
    if (index === spyData.answer) {
      setScore((prev) => prev + 1);
      generateSpy();
    } else {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSortClick = (type: '🦴' | '🐟') => {
    if (gameState !== 'playing') return;
    if (type === sortItem) {
      setScore((prev) => prev + 1);
    } else {
      setScore((prev) => Math.max(0, prev - 1));
    }
    generateSort();
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-green-50 w-full max-w-2xl rounded-4xl border-8 border-green-800 shadow-[10px_10px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col items-center text-center">
        
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-red-500 text-white w-12 h-12 rounded-full border-4 border-red-900 font-extrabold text-2xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-0.5 active:translate-y-1 z-10">X</button>

        {mode === 'select' && (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-6 border-b-4 border-green-200 pb-4 w-full">👨‍🌾 알바 게시판</h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full mb-2">
              
              <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center shadow-sm">
                <span className="text-4xl md:text-5xl mb-2">🍎</span>
                <span className="font-extrabold text-lg md:text-xl text-gray-800 mb-1">사과 수확</span>
                <span className="text-xs md:text-sm font-bold text-gray-500 mb-3 h-10">10초간 무한 터치!<br/>(1개당 10 P)</span>
                <button onClick={() => startGame('apple')} className="w-full bg-green-500 text-white py-2 rounded-xl font-extrabold border-b-4 border-green-800 active:border-b-0 active:translate-y-1">시작하기</button>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center shadow-sm">
                <span className="text-4xl md:text-5xl mb-2">🌿</span>
                <span className="font-extrabold text-lg md:text-xl text-gray-800 mb-1">잡초 뽑기</span>
                <span className="text-xs md:text-sm font-bold text-gray-500 mb-3 h-10">15초간 순발력 테스트!<br/>(1개당 20 P)</span>
                <button onClick={() => startGame('weed')} className="w-full bg-orange-500 text-white py-2 rounded-xl font-extrabold border-b-4 border-orange-800 active:border-b-0 active:translate-y-1">시작하기</button>
              </div>

              <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center shadow-sm">
                <span className="text-4xl md:text-5xl mb-2">🐏</span>
                <span className="font-extrabold text-lg md:text-xl text-gray-800 mb-1">숨은 동물 찾기</span>
                <span className="text-xs md:text-sm font-bold text-gray-500 mb-3 h-10">다른 모양을 찾으세요!<br/>(1개당 30 P)</span>
                <button onClick={() => startGame('spy')} className="w-full bg-blue-500 text-white py-2 rounded-xl font-extrabold border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">시작하기</button>
              </div>

              <div className="bg-white p-4 rounded-2xl border-4 border-gray-300 flex flex-col items-center shadow-sm">
                <span className="text-4xl md:text-5xl mb-2">🦴</span>
                <span className="font-extrabold text-lg md:text-xl text-gray-800 mb-1">사료 분류</span>
                <span className="text-xs md:text-sm font-bold text-gray-500 mb-3 h-10">좌우 버튼으로 분류!<br/>(1개당 5 P)</span>
                <button onClick={() => startGame('sort')} className="w-full bg-purple-500 text-white py-2 rounded-xl font-extrabold border-b-4 border-purple-800 active:border-b-0 active:translate-y-1">시작하기</button>
              </div>

            </div>
          </>
        )}

        {gameState === 'playing' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex justify-between w-full mb-6 max-w-sm">
              <div className="bg-white px-4 py-2 rounded-xl border-4 border-gray-800"><span className="text-xl font-bold">⏱ {timeLeft}초</span></div>
              <div className="bg-white px-4 py-2 rounded-xl border-4 border-gray-800"><span className="text-xl font-bold">🎯 {score}점</span></div>
            </div>
            
            {mode === 'apple' && (
              <button onClick={handleAppleClick} className="text-[8rem] select-none active:scale-90 transition-transform drop-shadow-xl my-4">🍎</button>
            )}

            {mode === 'weed' && (
              <div className="grid grid-cols-3 gap-3 bg-amber-700 p-4 rounded-2xl border-4 border-amber-900 my-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <button key={i} onClick={() => handleWeedClick(i)} className="w-20 h-20 bg-amber-800 rounded-xl border-b-4 border-amber-950 flex items-center justify-center text-5xl overflow-hidden active:border-b-0 active:translate-y-1">
                    {activeWeed === i && <span className="animate-bounce">🌿</span>}
                  </button>
                ))}
              </div>
            )}

            {mode === 'spy' && (
              <div className="grid grid-cols-3 gap-3 bg-blue-100 p-4 rounded-2xl border-4 border-blue-300 my-2">
                {spyData.grid.map((emoji, i) => (
                  <button key={i} onClick={() => handleSpyClick(i)} className="w-20 h-20 bg-white rounded-xl border-b-4 border-blue-200 flex items-center justify-center text-5xl active:border-b-0 active:translate-y-1 shadow-sm">
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {mode === 'sort' && (
              <div className="flex flex-col items-center w-full max-w-sm my-4">
                <div className="text-[6rem] mb-8 animate-bounce bg-white p-4 rounded-full border-4 border-gray-300 shadow-md">{sortItem}</div>
                <div className="flex gap-4 w-full">
                  <button onClick={() => handleSortClick('🦴')} className="flex-1 flex flex-col items-center bg-gray-100 py-4 rounded-2xl border-b-8 border-gray-300 active:border-b-0 active:translate-y-2 transition-all">
                    <span className="text-5xl mb-2">🐶</span><span className="font-bold text-gray-600">뼈다귀</span>
                  </button>
                  <button onClick={() => handleSortClick('🐟')} className="flex-1 flex flex-col items-center bg-gray-100 py-4 rounded-2xl border-b-8 border-gray-300 active:border-b-0 active:translate-y-2 transition-all">
                    <span className="text-5xl mb-2">🐱</span><span className="font-bold text-gray-600">물고기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {gameState === 'result' && (
          <div className="w-full flex flex-col items-center max-w-sm">
            <h2 className="text-4xl font-extrabold text-green-900 mb-2">알바 완료!</h2>
            <p className="text-gray-600 font-bold mb-6">농장에 큰 도움이 되었습니다.</p>
            
            <div className="bg-white w-full py-6 rounded-2xl border-4 border-green-200 mb-4">
              <p className="text-lg text-gray-600 font-bold mb-2">최종 점수: {score}점</p>
              <p className="text-3xl font-extrabold text-yellow-500">
                💰 +{score * (mode === 'weed' ? 20 : mode === 'spy' ? 30 : mode === 'apple' ? 10 : 5)} P
              </p>
            </div>

            {/* 👇 페널티 안내 문구 */}
            <div className="bg-red-50 w-full py-3 rounded-xl border-2 border-red-200 mb-6">
              <p className="text-sm font-bold text-red-600">💦 알바하느라 동물이 지쳤어요 (포만감 -10, 행복도 -10)</p>
            </div>
            
            <div className="flex gap-4 w-full">
              <button onClick={() => { setMode('select'); setGameState('ready'); }} className="flex-1 bg-gray-500 text-white text-lg font-extrabold py-3 rounded-xl border-b-4 border-gray-800 active:border-b-0 active:translate-y-1">다른 알바</button>
              <button onClick={onClose} className="flex-2 bg-blue-500 text-white text-lg font-extrabold py-3 rounded-xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">농장으로 돌아가기</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MiniGameModal;