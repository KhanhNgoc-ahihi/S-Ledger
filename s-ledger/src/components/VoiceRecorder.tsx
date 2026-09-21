'use client';
import { useState } from 'react';
import { useStore } from '../app/store/useStore';
import { Mic, MicOff, Loader2, Keyboard, PlusCircle, MinusCircle, Calendar, Users, Hash, Wallet, CreditCard, Landmark, QrCode } from 'lucide-react';

export default function VoiceRecorder() {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const addTransaction = useStore((state: any) => state.addTransaction);
  const addDebt = useStore((state: any) => state.addDebt);

  const getToday = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzoffset).toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getToday());
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [person, setPerson] = useState('');
  const [paymentType, setPaymentType] = useState<'cash' | 'debt'>('cash');
  const [method, setMethod] = useState<'Tiền mặt' | 'Chuyển khoản' | 'Khác'>('Tiền mặt');

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setLoading(true);
        setTimeout(() => {
          addTransaction({
            id: Date.now().toString(),
            type: 'income',
            item: 'Bán hàng (Giọng nói)',
            totalAmount: 200000,
            quantity: 1,
            person: 'Khách lẻ',
            method: 'Tiền mặt',
            date: date + 'T12:00:00.000Z'
          });
          setLoading(false);
        }, 1000);
      }, 3000);
    }
  };

  const handleTextSubmit = (type: 'income' | 'expense') => {
    if (!item || !amount) {
      alert("Vui lòng nhập tên món hàng và số tiền!");
      return;
    }
    
    const txId = Date.now().toString();
    const finalAmount = parseInt(amount.replace(/\D/g, '') || '0');
    const finalPerson = person.trim() || 'Khách lẻ';
    const finalQty = parseInt(quantity) || 1;
    const finalDate = date + 'T12:00:00.000Z';

    // 1. Luôn luôn ghi nhận vào Sổ Giao Dịch chung để lịch sử hiển thị đầy đủ thu/chi
    addTransaction({
      id: txId,
      type,
      item,
      totalAmount: finalAmount,
      quantity: finalQty,
      person: finalPerson,
      method: method,
      date: finalDate
    });

    // 2. NẾU LÀ GHI NỢ -> Đồng thời đẩy sang Sổ Công Nợ để quản lý riêng
    if (paymentType === 'debt') {
      addDebt({
        id: txId,
        type,
        item,
        debtAmount: finalAmount,
        quantity: finalQty,
        person: finalPerson,
        method: method,
        date: finalDate,
        isPaid: false
      });
      alert(`Đã ghi sổ nợ cho: ${finalPerson}`);
    } else {
      alert(`Đã ghi nhận giao dịch thành công!`);
    }

    // Reset form
    setItem('');
    setAmount('');
    setQuantity('1');
    setPerson('');
    setPaymentType('cash');
    setMethod('Tiền mặt');
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4 w-full max-w-xs">
        <button onClick={() => setMode('voice')} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'voice' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}>
          <Mic className="w-4 h-4" /> Giọng nói
        </button>
        <button onClick={() => setMode('text')} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'text' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}>
          <Keyboard className="w-4 h-4" /> Nhập tay
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
        <Calendar className="w-4 h-4 text-gray-400" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-sm font-semibold text-gray-700 outline-none" />
      </div>

      {mode === 'voice' && (
        <div className="flex flex-col items-center">
          <button onClick={toggleRecording} disabled={loading} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center px-4">
            {loading ? 'Đang phân tích...' : isRecording ? 'Đang nghe...' : 'Chạm để đọc giao dịch'}
          </p>
        </div>
      )}

      {mode === 'text' && (
        <div className="w-full space-y-3 px-2">
          <div className="flex gap-2">
            <input type="text" placeholder="Tên hàng / Dịch vụ..." value={item} onChange={(e) => setItem(e.target.value)} className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm" />
            <div className="w-20 flex items-center bg-white border rounded-xl overflow-hidden px-2">
              <Hash className="w-4 h-4 text-gray-400 mr-1" />
              <input type="number" placeholder="SL" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full py-3 outline-none text-sm bg-transparent" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white border rounded-xl px-2">
              <Users className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Tên khách / Nguồn hàng..." value={person} onChange={(e) => setPerson(e.target.value)} className="w-full py-3 outline-none text-sm bg-transparent" />
            </div>
            <input type="number" placeholder="Số tiền (đ)..." value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold text-green-700" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1 ml-1">Hình thức thanh toán:</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setMethod('Tiền mặt')} 
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${method === 'Tiền mặt' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <Wallet className="w-3.5 h-3.5" /> Tiền mặt
              </button>
              <button 
                onClick={() => setMethod('Chuyển khoản')} 
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${method === 'Chuyển khoản' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <Landmark className="w-3.5 h-3.5" /> Chuyển khoản
              </button>
              <button 
                onClick={() => setMethod('Khác')} 
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${method === 'Khác' ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <QrCode className="w-3.5 h-3.5" /> Khác
              </button>
            </div>
          </div>

          <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button onClick={() => setPaymentType('cash')} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${paymentType === 'cash' ? 'bg-white shadow-sm text-green-600 border border-green-100' : 'text-gray-500'}`}>
              <Wallet className="w-3.5 h-3.5" /> Đã thanh toán
            </button>
            <button onClick={() => setPaymentType('debt')} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${paymentType === 'debt' ? 'bg-orange-100 shadow-sm text-orange-600 border border-orange-200' : 'text-gray-500'}`}>
              <CreditCard className="w-3.5 h-3.5" /> Ghi sổ nợ
            </button>
          </div>
          
          <div className="flex gap-2 pt-1">
            <button onClick={() => handleTextSubmit('income')} className="flex-1 bg-green-100 text-green-700 p-3 rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-green-200 transition-colors text-sm">
              <PlusCircle className="w-5 h-5" /> THU TIỀN
            </button>
            <button onClick={() => handleTextSubmit('expense')} className="flex-1 bg-red-100 text-red-700 p-3 rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-red-200 transition-colors text-sm">
              <MinusCircle className="w-5 h-5" /> CHI TIỀN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}