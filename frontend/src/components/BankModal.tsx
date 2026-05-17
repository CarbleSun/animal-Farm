import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useBankStore, ACCOUNT_INFO, type AccountTier } from '../store/useBankStore';
import { useAlertStore } from '../store/useAlertStore';

interface BankModalProps {
  onClose: () => void;
}

const BankModal = ({ onClose }: BankModalProps) => {
  const points = useUserStore((state) => state.points);
  const { bankBalance, accountTier, transactions, deposit, withdraw, changeAccountTier } = useBankStore();
  const showAlert = useAlertStore((state) => state.showAlert); // 알림 함수 임포트
  
  const [tab, setTab] = useState<'banking' | 'tier' | 'history'>('banking');
  const [amountInput, setAmountInput] = useState('');

  const currentInfo = ACCOUNT_INFO[accountTier];

  const handleDeposit = () => {
    const amount = parseInt(amountInput, 10);
    if (isNaN(amount) || amount <= 0) {
      showAlert('올바른 금액을 입력하세요.');
      return;
    }
    if (points < amount) {
      showAlert('보유 포인트가 부족합니다.');
      return;
    }
    if (bankBalance + amount > currentInfo.max) {
      showAlert(`한도 초과입니다.\n(${currentInfo.name} 한도: ${currentInfo.max.toLocaleString()} P)`);
      return;
    }
    
    if (deposit(amount)) {
      showAlert(`${amount.toLocaleString()} P 예금 완료!`);
      setAmountInput('');
    }
  };

  const handleWithdraw = () => {
    const amount = parseInt(amountInput, 10);
    if (isNaN(amount) || amount <= 0) {
      showAlert('올바른 금액을 입력하세요.');
      return;
    }
    if (bankBalance < amount) {
      showAlert('통장 잔고가 부족합니다.');
      return;
    }
    
    if (withdraw(amount)) {
      showAlert(`${amount.toLocaleString()} P 출금 완료!`);
      setAmountInput('');
    }
  };

  const handleTierChange = (tier: AccountTier) => {
    const reqMin = ACCOUNT_INFO[tier].reqMin;
    if (bankBalance < reqMin) {
      showAlert(`통장 잔고가 최소 ${reqMin.toLocaleString()} P\n이상이어야 가입 가능합니다.`);
      return;
    }
    if (changeAccountTier(tier)) {
      showAlert(`${ACCOUNT_INFO[tier].name}으로 변경되었습니다.`);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-orange-50 w-full max-w-[480px] rounded-[2rem] border-8 border-orange-600 shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 relative flex flex-col max-h-[90%] min-h-[400px]">
        
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-red-500 text-white w-11 h-11 rounded-full border-4 border-red-900 font-extrabold text-xl shadow-[0_4px_0_#7f1d1d] hover:translate-y-[2px] active:translate-y-[4px] z-10">X</button>
        
        <h2 className="text-3xl font-extrabold text-orange-900 mb-5 text-center border-b-4 border-orange-200 pb-4">🏦 쥬니버 은행</h2>
        
        <div className="flex mb-5 bg-orange-200 rounded-xl p-1 border-2 border-orange-300 shrink-0">
          <button onClick={() => setTab('banking')} className={`flex-1 py-2 font-bold rounded-lg transition-all ${tab === 'banking' ? 'bg-white shadow-sm text-orange-800' : 'text-orange-600 hover:bg-orange-100'}`}>입출금</button>
          <button onClick={() => setTab('tier')} className={`flex-1 py-2 font-bold rounded-lg transition-all ${tab === 'tier' ? 'bg-white shadow-sm text-orange-800' : 'text-orange-600 hover:bg-orange-100'}`}>통장 관리</button>
          <button onClick={() => setTab('history')} className={`flex-1 py-2 font-bold rounded-lg transition-all ${tab === 'history' ? 'bg-white shadow-sm text-orange-800' : 'text-orange-600 hover:bg-orange-100'}`}>거래내역</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          
          {tab === 'banking' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-4 border-orange-200 shrink-0">
                <span className="font-bold text-gray-500">현재 이용중인 통장</span>
                <span className="font-black text-orange-600 text-lg">{currentInfo.name}</span>
              </div>
              
              <div className="flex justify-between gap-3 shrink-0">
                <div className="flex-1 bg-yellow-100 p-4 rounded-2xl border-4 border-yellow-400 text-center flex flex-col justify-center">
                  <span className="text-xs font-bold text-yellow-800 mb-1">나의 지갑 (포인트)</span>
                  <span className="text-lg font-black text-yellow-900">{points.toLocaleString()} P</span>
                </div>
                <div className="flex-1 bg-blue-100 p-4 rounded-2xl border-4 border-blue-400 text-center flex flex-col justify-center">
                  <span className="text-xs font-bold text-blue-800 mb-1">은행 잔고 (한도 {currentInfo.max.toLocaleString()})</span>
                  <span className="text-lg font-black text-blue-900">{bankBalance.toLocaleString()} P</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-4 border-gray-200 shrink-0">
                <p className="text-center font-bold text-gray-600 mb-3 text-sm">입금/출금 할 금액을 입력하세요</p>
                <input 
                  type="number" 
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="금액 입력" 
                  className="w-full text-center text-xl font-black bg-gray-100 border-4 border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-orange-400"
                />
                <div className="flex gap-2">
                  <button onClick={handleDeposit} className="flex-1 bg-orange-500 text-white font-black py-3 rounded-xl border-b-4 border-orange-800 hover:bg-orange-400 active:border-b-0 active:translate-y-1">예금하기</button>
                  <button onClick={handleWithdraw} className="flex-1 bg-gray-500 text-white font-black py-3 rounded-xl border-b-4 border-gray-800 hover:bg-gray-400 active:border-b-0 active:translate-y-1">출금하기</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'tier' && (
            <div className="flex flex-col gap-3">
              {(Object.keys(ACCOUNT_INFO) as AccountTier[]).map((tierKey) => {
                const info = ACCOUNT_INFO[tierKey];
                const isActive = accountTier === tierKey;
                const isLocked = bankBalance < info.reqMin;

                return (
                  <div key={tierKey} className={`bg-white p-4 rounded-2xl border-4 flex flex-col gap-2 ${isActive ? 'border-orange-500 shadow-sm bg-orange-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-lg text-gray-800">{info.name}</span>
                      {isActive ? (
                        <span className="font-black text-orange-500 px-2 text-sm">사용중</span>
                      ) : (
                        <button 
                          onClick={() => handleTierChange(tierKey)}
                          disabled={isLocked}
                          className={`font-black px-3 py-1.5 rounded-xl border-b-4 text-sm active:border-b-0 active:translate-y-1 whitespace-nowrap ${isLocked ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 border-green-800 text-white'}`}
                        >
                          변경하기
                        </button>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-gray-500 space-y-1 bg-gray-100 p-2 rounded-lg">
                      <p>최대 저금 한도: {info.max.toLocaleString()} P</p>
                      <p>매일 이자 지급: <span className="text-blue-500">+{info.interest} P</span></p>
                      {info.reqMin > 0 && <p className={`${isLocked ? 'text-red-500' : 'text-green-600'}`}>가입 조건: 잔고 {info.reqMin.toLocaleString()} P 이상</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'history' && (
            <div className="bg-white rounded-2xl border-4 border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-3 font-bold text-gray-600 text-sm text-center border-b-4 border-gray-200 shrink-0">
                총 {transactions.length}번의 거래 내역 (최대 10건)
              </div>
              <ul className="divide-y-2 divide-gray-100">
                {transactions.length === 0 ? (
                  <li className="p-6 text-center font-bold text-gray-400">거래 내역이 없습니다.</li>
                ) : (
                  transactions.map(tx => (
                    <li key={tx.id} className="p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">{tx.date}</span>
                        <span className={`font-black text-xs px-2 py-0.5 rounded ${tx.type === '입금' ? 'bg-green-100 text-green-700' : tx.type === '출금' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{tx.type}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end flex-1 gap-3">
                        <span className={`font-black text-sm ${tx.type === '출금' ? 'text-red-500' : 'text-blue-500'}`}>
                          {tx.type === '출금' ? '-' : '+'}{tx.amount.toLocaleString()}
                        </span>
                        <span className="font-bold text-gray-400 text-xs w-[70px] text-right">{tx.balance.toLocaleString()}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankModal;