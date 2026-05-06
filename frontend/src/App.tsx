import CreateFarm from './components/CreateFarm';
import FarmMain from './components/FarmMain';
import { useGameStore } from './store/useGameStore';

function App() {
  const isFarmCreated = useGameStore((state) => state.isFarmCreated);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 플래시 플레이어 창 느낌의 컨테이너 */}
      <div className="w-full max-w-4xl aspect-4/3 sm:aspect-video bg-white rounded-xl overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.5)] border-12 border-gray-300">
        {/* 상단 가짜 타이틀 바 */}
        <div className="absolute top-0 w-full h-8 bg-blue-600 flex items-center px-3 z-50 border-b-2 border-blue-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-600"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-600"></div>
          </div>
          <span className="text-white text-xs ml-4 tracking-widest font-bold">ANIMAL FARM.swf</span>
        </div>

        {/* 실제 화면 렌더링 영역 (타이틀 바 높이만큼 패딩) */}
        <div className="w-full h-full pt-8 relative bg-sky-50">
          {isFarmCreated ? <FarmMain /> : <CreateFarm />}
        </div>
      </div>
    </div>
  );
}

export default App;