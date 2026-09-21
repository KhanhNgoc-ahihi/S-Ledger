'use client';
import { useStore } from './store/useStore';
import VoiceRecorder from '../components/VoiceRecorder';
import { User } from 'lucide-react'; // Đã thêm icon User cho Avatar

export default function HomePage() {
  const { currentUser, transactions } = useStore((state: any) => state);

  if (!currentUser) return null;

  return (
    <main className="space-y-4 pb-20 pt-2">
      
      {/* KHÚC CHÀO HỎI & AVATAR ĐÃ ĐƯỢC CẬP NHẬT GỌN GÀNG */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-5 rounded-3xl shadow-md text-white flex justify-between items-center">
        <div>
          <p className="text-green-100 text-sm mb-1">Xin chào,</p>
          <h1 className="text-2xl font-bold mb-2">{currentUser.fullName}</h1>
          <div className="bg-white/20 rounded-xl p-3 inline-block">
            <p className="font-semibold">{currentUser.shopName}</p>
            <p className="text-xs text-green-50 mt-1">
              {currentUser.storeScale} • {currentUser.businessType || 'Buôn bán'}
            </p>
          </div>
        </div>
        
        {/* Vòng tròn Avatar */}
        <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-green-400 flex flex-shrink-0 items-center justify-center shadow-sm">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-4 text-center border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-2">Ghi sổ bằng giọng nói</h2>
        <VoiceRecorder />
      </div>

      <div>
        <h3 className="font-bold text-gray-700 mb-3 ml-1">Giao dịch gần đây</h3>
        <div className="space-y-3">
          {transactions && transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{tx.item}</p>
                  <p className="text-xs text-gray-500 mt-1">Khách: {tx.person || 'Khách lẻ'}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.totalAmount?.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-2xl text-center border border-gray-100 border-dashed">
              <p className="text-gray-400 text-sm">Chưa có giao dịch nào hôm nay</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}