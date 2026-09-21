'use client';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { List, TrendingUp, TrendingDown, Clock, CreditCard } from 'lucide-react';

export default function TransactionsPage() {
  const transactions = useStore((state: any) => state.transactions || []);
  const debts = useStore((state: any) => state.debts || []);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'debt'>('all');

  // Lọc danh sách theo Tab
  const filteredTransactions = transactions.filter((t: any) => {
    if (filter === 'income') return t.type === 'income';
    if (filter === 'expense') return t.type === 'expense';
    return true; // 'all'
  });

  return (
    <div className="space-y-6 pt-2 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <List className="w-6 h-6 text-green-600" /> Sổ Giao Dịch
      </h1>

      {/* Các nút lọc tab */}
      <div className="flex bg-gray-200 p-1 rounded-xl overflow-x-auto gap-1">
        <button 
          onClick={() => setFilter('all')} 
          className={`flex-1 min-w-[70px] text-xs font-bold py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
        >
          Tất cả
        </button>
        <button 
          onClick={() => setFilter('income')} 
          className={`flex-1 min-w-[70px] text-xs font-bold py-2 rounded-lg transition-all ${filter === 'income' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
        >
          Tiền vào
        </button>
        <button 
          onClick={() => setFilter('expense')} 
          className={`flex-1 min-w-[70px] text-xs font-bold py-2 rounded-lg transition-all ${filter === 'expense' ? 'bg-white shadow-sm text-red-500' : 'text-gray-500'}`}
        >
          Tiền ra
        </button>
        <button 
          onClick={() => setFilter('debt')} 
          className={`flex-1 min-w-[70px] text-xs font-bold py-2 rounded-lg transition-all ${filter === 'debt' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-500'}`}
        >
          Có công nợ
        </button>
      </div>

      {/* Hiển thị danh sách */}
      <div className="space-y-3">
        {filter !== 'debt' ? (
          // Hiển thị Sổ Giao Dịch (Thu / Chi)
          filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx: any) => {
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800 text-base">{tx.item}</h4>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">x{tx.quantity || 1}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Khách/Nguồn: <span className="font-semibold text-gray-700">{tx.person || 'Khách lẻ'}</span></p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                      <span>{tx.method || 'Tiền mặt'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(tx.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
                      {isIncome ? '+' : '-'}{tx.totalAmount?.toLocaleString('vi-VN')} đ
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-1 ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isIncome ? 'Thu vào' : 'Chi ra'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 border-dashed">
              <p className="text-gray-400 text-sm">Không tìm thấy giao dịch nào.</p>
            </div>
          )
        ) : (
          // Hiển thị riêng tab Công nợ trong Sổ Giao Dịch cho bạn dễ theo dõi
          debts.length > 0 ? (
            debts.map((debt: any) => {
              const isIncome = debt.type === 'income';
              return (
                <div key={debt.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-l-orange-400 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800 text-base">{debt.item}</h4>
                      <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-medium">Nợ</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Đối tượng: <span className="font-semibold text-gray-700">{debt.person || 'Khách lẻ'}</span></p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(debt.date).toLocaleDateString('vi-VN')} - {debt.isPaid ? 'Đã thanh toán' : 'Chưa trả'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-orange-600">
                      {debt.debtAmount?.toLocaleString('vi-VN')} đ
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-1 bg-orange-100 text-orange-700">
                      {isIncome ? 'Khách nợ' : 'Mình nợ'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 border-dashed">
              <CreditCard className="w-10 h-10 text-orange-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Chưa có khoản công nợ nào.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}