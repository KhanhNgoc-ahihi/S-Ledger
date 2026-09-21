'use client';
import { useStore } from '../store/useStore';
import { Calculator, CheckCircle2, Clock, AlertCircle, RotateCcw } from 'lucide-react';

export default function DebtsPage() {
  const debts = useStore((state: any) => state.debts || []);
  const toggleDebtPaid = useStore((state: any) => state.toggleDebtPaid);

  // Tính tổng nợ chưa hoàn tất
  const activeDebts = debts.filter((d: any) => !d.isPaid);
  const totalReceivable = activeDebts.filter((d: any) => d.type === 'income').reduce((sum: number, d: any) => sum + (d.debtAmount || 0), 0);
  const totalPayable = activeDebts.filter((d: any) => d.type === 'expense').reduce((sum: number, d: any) => sum + (d.debtAmount || 0), 0);

  // Sắp xếp: Khoản chưa trả (isPaid = false) lên trên, khoản đã hoàn tất xuống dưới
  const sortedDebts = [...debts].sort((a, b) => (a.isPaid === b.isPaid ? 0 : a.isPaid ? 1 : -1));

  return (
    <div className="space-y-6 pt-2 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-orange-500" /> Sổ Công Nợ
      </h1>

      {/* Tổng quan nợ */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 relative overflow-hidden">
          <p className="text-xs text-gray-500 font-medium">Khách nợ mình</p>
          <p className="text-lg font-bold text-green-600 mt-1">{totalReceivable.toLocaleString('vi-VN')} đ</p>
          <p className="text-[10px] text-gray-400 mt-1">Chưa thanh toán</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 relative overflow-hidden">
          <p className="text-xs text-gray-500 font-medium">Mình nợ người ta</p>
          <p className="text-lg font-bold text-red-500 mt-1">{totalPayable.toLocaleString('vi-VN')} đ</p>
          <p className="text-[10px] text-gray-400 mt-1">Chưa thanh toán</p>
        </div>
      </div>

      {/* Danh sách nợ */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" /> Theo dõi công nợ
        </h3>
        
        <div className="space-y-3">
          {sortedDebts.length > 0 ? (
            sortedDebts.map((debt: any) => {
              const isDone = debt.isPaid;
              return (
                <div 
                  key={debt.id} 
                  className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 transition-all flex flex-col gap-3 ${
                    isDone ? 'opacity-60 bg-gray-50 border-l-gray-300' : 'border-l-orange-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-bold text-lg ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {debt.person || 'Khách lẻ'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{debt.item} <span className="text-xs text-gray-400">(x{debt.quantity || 1})</span></p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(debt.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${isDone ? 'text-gray-400 line-through' : debt.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                        {debt.debtAmount?.toLocaleString('vi-VN')} đ
                      </p>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold inline-block mt-1 ${isDone ? 'bg-gray-200 text-gray-600' : debt.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isDone ? 'Đã hoàn tất' : debt.type === 'income' ? 'Phải thu' : 'Phải trả'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3">
                    {isDone ? (
                      <button 
                        onClick={() => toggleDebtPaid(debt.id)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" /> Hoàn tác (Chưa thanh toán)
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleDebtPaid(debt.id)}
                        className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 p-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Đã thanh toán (Hoàn tất)
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 border-dashed">
              <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">Trống!</p>
              <p className="text-sm text-gray-400 mt-1">Chưa có khoản nợ nào được ghi nhận.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}