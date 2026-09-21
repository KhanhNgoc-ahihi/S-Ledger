'use client';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const loginUser = useStore((state) => state.loginUser);
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = loginUser(phone, password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col justify-center h-full space-y-6 pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700">S-Ledger</h1>
        <p className="text-gray-500 mt-2">Đăng nhập để quản lý sổ sách</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="0912345678" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="Nhập mật khẩu" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition flex justify-center items-center">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng nhập'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Chưa có tài khoản? <Link href="/register" className="text-green-600 font-bold hover:underline">Đăng ký ngay</Link>
      </p>
    </div>
  );
}