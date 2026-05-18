import { useAlertStore } from '../store/useAlertStore';

const GlobalAlert = () => {
  const { isOpen, type, message, onConfirm, onCancel, closeAlert } = useAlertStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    closeAlert();
  };

  const handleCancel = () => {
    onCancel();
    closeAlert();
  };

  const lines = message.split('\n');

  return (
    <>
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      
      <div className="fixed inset-0 bg-black/60 z-99999 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm rounded-4xl border-8 border-sky-400 shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col items-center text-center animate-pop-in">
          <h2 className="text-2xl font-black text-sky-900 mb-4 border-b-4 border-sky-200 pb-2 w-full">
            {type === 'confirm' ? '선택해 주세요' : '알림'}
          </h2>
          
          <div className="text-lg font-bold text-gray-700 mb-6 space-y-1">
            {lines.map((line, i) => <p key={i}>{line}</p>)}
          </div>
          
          <div className="flex gap-3 w-full">
            {type === 'confirm' && (
              <button 
                onClick={handleCancel} 
                className="flex-1 bg-gray-400 text-white font-black py-3 rounded-xl border-b-4 border-gray-600 hover:bg-gray-300 active:border-b-0 active:translate-y-1 transition-all"
              >
                아니오
              </button>
            )}
            <button 
              onClick={handleConfirm} 
              className="flex-1 bg-sky-500 text-white font-black py-3 rounded-xl border-b-4 border-sky-800 hover:bg-sky-400 active:border-b-0 active:translate-y-1 transition-all"
            >
              {type === 'confirm' ? '예' : '확인'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalAlert;