import CreateFarm from './components/CreateFarm';
import FarmMain from './components/FarmMain';
import { useUserStore } from './store/useUserStore';

function App() {
  const isFarmCreated = useUserStore((state) => state.isFarmCreated);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* ✨ 변경된 부분:
        1. max-w-4xl(약 896px) -> max-w-6xl(약 1152px)로 가로를 대폭 키웠습니다.
        2. aspect-video(16:9) -> aspect-[16/10] 으로 변경하여 세로 높이를 더 넉넉하게 확보했습니다.
      */}
      <div className="w-full max-w-6xl aspect-4/3 md:aspect-16/10 bg-white rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.6)] border-16 border-gray-300">
        
        {/* 상단 가짜 타이틀 바 */}
        <div className="absolute top-0 w-full h-8 bg-blue-600 flex items-center px-3 z-50 border-b-2 border-blue-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-600"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-600"></div>
          </div>
          <span className="text-white text-xs ml-4 tracking-widest font-bold">ANIMAL FARM.swf</span>
        </div>

        {/* 실제 화면 렌더링 영역 */}
        <div className="w-full h-full pt-8 relative bg-sky-50">
          {isFarmCreated ? <FarmMain /> : <CreateFarm />}
        </div>
      </div>
    </div>
  );
}

export default App;