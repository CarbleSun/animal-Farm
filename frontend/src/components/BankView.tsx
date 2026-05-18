import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useBankStore, ACCOUNT_INFO, type AccountTier } from '../store/useBankStore';
import { useAlertStore } from '../store/useAlertStore';

const BankView = () => {
  const points = useUserStore((state) => state.points);
  const { bankBalance, accountTier, transactions, deposit, withdraw } = useBankStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  
  const [tab, setTab] = useState<'banking' | 'info' | 'history'>('banking');
  const [amountInput, setAmountInput] = useState('');

  const currentInfo = ACCOUNT_INFO[accountTier];

  const handleDeposit = () => {
    const amount = parseInt(amountInput, 10);
    if (isNaN(amount) || amount <= 0) return showAlert('올바른 금액을 입력하세요.');
    if (points < amount) return showAlert('보유 포인트가 부족합니다.');
    
    if (deposit(amount)) {
      showAlert(`${amount.toLocaleString()} P 예금 완료!`);
      setAmountInput('');
    } else {
      showAlert('최대 저금 한도를 초과하여\n입금할 수 없습니다.');
    }
  };

  const handleWithdraw = () => {
    const amount = parseInt(amountInput, 10);
    if (isNaN(amount) || amount <= 0) return showAlert('올바른 금액을 입력하세요.');
    if (bankBalance < amount) return showAlert('통장 잔고가 부족합니다.');
    
    if (withdraw(amount)) {
      showAlert(`${amount.toLocaleString()} P 출금 완료!`);
      setAmountInput('');
    }
  };

  return (
    // 박스 형태를 제거하고 전체 화면(bg-orange-50)을 채우도록 레이아웃 변경
    <div className="w-full h-full bg-orange-50 flex flex-col p-4 md:p-8 overflow-hidden relative">
      
      {/* 헤더 영역 */}
      <div className="flex items-center justify-center mb-6 border-b-4 border-orange-200 pb-4 shrink-0">
        <h2 className="text-3xl font-extrabold text-orange-900 text-center py-1">🏦 쥬니버 은행</h2>
      </div>
      
      {/* 탭 메뉴 */}
      <div className="flex mb-6 bg-orange-200 rounded-xl p-1 border-2 border-orange-300 shrink-0 max-w-xl mx-auto w-full text-lg shadow-sm">
        <button onClick={() => setTab('banking')} className={`flex-1 py-3 font-bold rounded-lg transition-all ${tab === 'banking' ? 'bg-white shadow-sm text-orange-800' : 'text-orange-600 hover:bg-orange-100'}`}>입출금</button>
        <button onClick={() => setTab('info')} className={`flex-1 py-3 font-bold rounded-lg transition-all ${tab === 'info' ? 'bg-white shadow-sm text-orange-800' : 'text-orange-600 hover:bg-orange-100'}`}>등급 안내</button>
        <button onClick={() => setTab('history')} className={`flex-1 py-3 font-bold rounded-lg transition-all ${tab === 'history' ? 'bg-white shadow-sm text-orange-800' : 'text-orange-600 hover:bg-orange-100'}`}>거래내역</button>
      </div>

      {/* 스크롤바가 허공에 뜨지 않도록 최상위 컨테이너에 overflow 적용 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar w-full pb-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 px-2 md:px-0">
          
          {tab === 'banking' && (
            <>
              <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border-4 border-orange-200 shrink-0 shadow-sm text-center">
                <span className="font-bold text-gray-500 text-base">현재 이용중인 통장</span>
                <span className="font-black text-orange-600 text-xl">{currentInfo.name}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                <div className="bg-yellow-100 p-5 rounded-2xl border-4 border-yellow-400 text-center flex flex-col justify-center shadow-sm">
                  <span className="text-xs font-bold text-yellow-800 mb-1.5">나의 지갑 (포인트)</span>
                  <span className="text-2xl font-black text-yellow-900">{points.toLocaleString()} P</span>
                </div>
                <div className="bg-blue-100 p-5 rounded-2xl border-4 border-blue-400 text-center flex flex-col justify-center shadow-sm">
                  <span className="text-xs font-bold text-blue-800 mb-1.5">은행 잔고 (한도 {currentInfo.max.toLocaleString()})</span>
                  <span className="text-2xl font-black text-blue-900">{bankBalance.toLocaleString()} P</span>
                </div>
              </div>

              <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl border-4 border-gray-200 shrink-0 shadow-sm mt-4">
                <p className="text-center font-bold text-gray-600 mb-4 text-base">입금/출금 할 금액을 입력하세요</p>
                <input 
                  type="number" 
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="금액 입력" 
                  className="w-full max-w-md mx-auto text-center text-2xl font-black bg-gray-100 border-4 border-gray-300 rounded-xl p-3 mb-5 focus:outline-none focus:border-orange-400 block"
                />
                <div className="flex gap-3 max-w-md mx-auto">
                  <button onClick={handleDeposit} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-black text-lg py-3.5 rounded-xl border-b-4 border-orange-800 active:border-b-0 active:translate-y-1">예금하기</button>
                  <button onClick={handleWithdraw} className="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-black text-lg py-3.5 rounded-xl border-b-4 border-gray-800 active:border-b-0 active:translate-y-1">출금하기</button>
                </div>
              </div>
            </>
          )}

          {tab === 'info' && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-bold text-orange-700 text-center bg-orange-100 p-2 rounded-lg border border-orange-200 mb-1">
                💡 통장 등급은 예금 잔고에 따라 자동으로 업그레이드 및 다운그레이드됩니다.
              </p>
              {(Object.keys(ACCOUNT_INFO) as AccountTier[]).map((tierKey) => {
                const info = ACCOUNT_INFO[tierKey];
                const isActive = accountTier === tierKey;

                return (
                  <div key={tierKey} className={`bg-white p-4.5 rounded-2xl border-4 flex flex-col gap-3 transition-all ${isActive ? 'border-orange-500 shadow-md bg-orange-50 scale-[1.01]' : 'border-gray-200 opacity-70'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-black text-lg ${isActive ? 'text-orange-900' : 'text-gray-800'}`}>{info.name}</span>
                      {isActive && (
                        <span className="font-black text-orange-500 bg-orange-100 px-3 py-1 rounded-full text-[10px] border border-orange-300 shadow-sm">
                          현재 적용중
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-gray-500 space-y-1.5 bg-gray-100 p-3 rounded-lg border border-gray-200">
                      <p>최대 저금 한도: {info.max.toLocaleString()} P</p>
                      <p>매일 이자 지급: <span className="text-blue-500">+{info.interest} P</span></p>
                      {info.reqMin > 0 && <p className="text-orange-600">자동 승급 조건: 잔고 {info.reqMin.toLocaleString()} P 이상 달성 시</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'history' && (
            <div className="bg-white rounded-2xl border-4 border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-100 p-3.5 font-bold text-gray-600 text-sm text-center border-b-4 border-gray-200 shrink-0">
                총 {transactions.length}번의 거래 내역 (최대 10건)
              </div>
              <ul className="divide-y-2 divide-gray-100 text-sm">
                {transactions.length === 0 ? (
                  <li className="p-10 text-center font-bold text-gray-400 text-base">거래 내역이 없습니다.</li>
                ) : (
                  transactions.map(tx => (
                    <li key={tx.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400">{tx.date}</span>
                        <span className={`font-black text-[11px] px-2.5 py-0.5 rounded-md ${tx.type === '입금' ? 'bg-green-100 text-green-700' : tx.type === '출금' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{tx.type}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end flex-1 gap-5">
                        <span className={`font-black text-base ${tx.type === '출금' ? 'text-red-500' : 'text-blue-500'}`}>
                          {tx.type === '출금' ? '-' : '+'}{tx.amount.toLocaleString()} P
                        </span>
                        <span className="font-bold text-gray-400 text-xs w-20 text-right">{tx.balance.toLocaleString()} P</span>
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

export default BankView;