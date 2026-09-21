'use client';
import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { CalendarDays, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export default function SchedulePage() {
  const transactions = useStore((state: any) => state.transactions || []);
  const [tab, setTab] = useState<'day' | 'week' | 'month' | 'year'>('day');

  // Tính toán dữ liệu
  const { income, expense, count, chartData } = useMemo(() => {
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localNow = new Date(Date.now() - tzoffset);
    const todayStr = localNow.toISOString().split('T')[0];
    const currentMonth = localNow.getMonth();
    const currentYear = localNow.getFullYear();

    let filtered = transactions;
    let dataForChart: { label: string; income: number; expense: number }[] = [];

    // Lọc theo Tab
    if (tab === 'day') {
      filtered = transactions.filter((t: any) => t.date?.startsWith(todayStr));
    } else if (tab === 'month') {
      filtered = transactions.filter((t: any) => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      // Tạo biểu đồ 4 tuần của tháng
      dataForChart = [1, 2, 3, 4].map(w => ({ label: `Tuần ${w}`, income: 0, expense: 0 }));
      filtered.forEach((t: any) => {
        const day = new Date(t.date).getDate();
        const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
        if (t.type === 'income') dataForChart[weekIndex].income += t.totalAmount;
        else dataForChart[weekIndex].expense += t.totalAmount;
      });
    } else if (tab === 'year') {
      filtered = transactions.filter((t: any) => new Date(t.date).getFullYear() === currentYear);
      // Tạo biểu đồ 12 tháng
      dataForChart = Array.from({length: 12}, (_, i) => ({ label: `T${i+1}`, income: 0, expense: 0 }));
      filtered.forEach((t: any) => {
        const monthIndex = new Date(t.date).getMonth();
        if (t.type === 'income') dataForChart[monthIndex].income += t.totalAmount;
        else dataForChart[monthIndex].expense += t.totalAmount;
      });
    }

    const inc = filtered.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + (t.totalAmount || 0), 0);
    const exp = filtered.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + (t.totalAmount || 0), 0);
    
    return { income: inc, expense: exp, count: filtered.length, chartData: dataForChart };
  }, [transactions, tab]);

  // Tìm mức cao nhất để vẽ cột biểu đồ (nếu có biểu đồ)
  const maxChartValue = chartData.length > 0 ? Math.max(...chartData.map(d => Math.max(d.income, d.expense))) : 1;

  const tabs = [
    { id: 'day', label: 'Hôm nay' },
    { id: 'week', label: 'Tuần này' },
    { id: 'month', label: 'Tháng này' },
    { id: 'year', label: 'Năm nay' }
  ];

  return (
    <div className="space-y-6 pt-2 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-green-600" /> Báo cáo doanh thu
      </h1>

      {/* Tabs */}
      <div className="flex bg-gray-200 p-1 rounded-xl">
        {tabs.map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${tab === t.id ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bảng số liệu Tổng */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="text-center pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Lợi nhuận gộp</p>
          <h2 className={`text-3xl font-bold ${income - expense >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {(income - expense).toLocaleString('vi-VN')} đ
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-green-50 p-4 rounded-2xl">
            <div className="flex items-center gap-1 text-green-600 mb-1">
              <TrendingUp className="w-4 h-4" /> <span className="text-xs font-bold">Thu vào</span>
            </div>
            <p className="font-bold text-gray-800">{income.toLocaleString('vi-VN')} đ</p>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl">
            <div className="flex items-center gap-1 text-red-500 mb-1">
              <TrendingDown className="w-4 h-4" /> <span className="text-xs font-bold">Chi ra</span>
            </div>
            <p className="font-bold text-gray-800">{expense.toLocaleString('vi-VN')} đ</p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Đã ghi nhận {count} giao dịch</p>
      </div>

      {/* BIỂU ĐỒ (Chỉ hiện ở Tháng và Năm) */}
      {(tab === 'month' || tab === 'year') && chartData.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Biểu đồ thu chi
          </h3>
          
          <div className="flex items-end justify-between h-40 gap-2">
            {chartData.map((col, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div className="flex items-end justify-center w-full h-32 gap-1 bg-gray-50 rounded-t-lg p-1">
                  {/* Cột Thu (Xanh) */}
                  <div 
                    className="w-1/2 bg-green-400 rounded-t-sm transition-all duration-500 group-hover:bg-green-500" 
                    style={{ height: `${maxChartValue > 0 ? (col.income / maxChartValue) * 100 : 0}%`, minHeight: col.income > 0 ? '4px' : '0' }}
                    title={`Thu: ${col.income.toLocaleString('vi-VN')}đ`}
                  ></div>
                  {/* Cột Chi (Đỏ) */}
                  <div 
                    className="w-1/2 bg-red-400 rounded-t-sm transition-all duration-500 group-hover:bg-red-500" 
                    style={{ height: `${maxChartValue > 0 ? (col.expense / maxChartValue) * 100 : 0}%`, minHeight: col.expense > 0 ? '4px' : '0' }}
                    title={`Chi: ${col.expense.toLocaleString('vi-VN')}đ`}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 font-medium">{col.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-sm"></div> Thu</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Chi</span>
          </div>
        </div>
      )}
    </div>
  );
}