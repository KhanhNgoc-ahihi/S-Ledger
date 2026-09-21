'use client';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useStore((state: any) => state.registerUser);
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', shopName: '', storeScale: 'Bán lẻ/Nhỏ', businessType: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.phone || !formData.shopName || !formData.password || !formData.businessType) {
      return setError('Vui lòng điền đầy đủ thông tin.');
    }
    if (formData.password.length < 6) {
      return setError('Mật khẩu tối thiểu 6 ký tự.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp.');
    }

    setLoading(true);
    setTimeout(() => {
      const result = registerUser({
        id: Date.now().toString(),
        fullName: formData.fullName,
        phone: formData.phone,
        shopName: formData.shopName,
        storeScale: formData.storeScale,
        businessType: formData.businessType,
        password: formData.password
      });

      if (result.success) {
        router.push('/');
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col justify-center h-full space-y-5 pt-2 pb-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-700">Tạo tài khoản S-Ledger</h1>
      </div>

      <form onSubmit={handleRegister} className="space-y-3">
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        
        <input type="text" name="fullName" placeholder="Họ và tên chủ quán" value={formData.fullName} onChange={handleChange} className="w-full p-3 border rounded-xl" />
        <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-xl" />
        
        <div className="flex gap-2">
          <input type="text" name="shopName" placeholder="Tên cửa hàng" value={formData.shopName} onChange={handleChange} className="w-1/2 p-3 border rounded-xl" />
          <select name="storeScale" value={formData.storeScale} onChange={handleChange} className="w-1/2 p-3 border rounded-xl bg-white text-gray-700">
            <option value="Bán lẻ/Nhỏ">Bán lẻ/Nhỏ</option>
            <option value="Bán buôn/Lớn">Bán buôn/Lớn</option>
            <option value="Chuỗi cửa hàng">Chuỗi cửa hàng</option>
          </select>
        </div>
        
        <input type="text" name="businessType" placeholder="Lĩnh vực (Vd: Tạp hóa, Trái cây...)" value={formData.businessType} onChange={handleChange} className="w-full p-3 border rounded-xl" />
        
        <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-xl" />
        <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 border rounded-xl" />

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-xl font-bold flex justify-center items-center mt-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng ký'}
        </button>
      </form>
      <p className="text-center text-sm">
        Đã có tài khoản? <Link href="/login" className="text-green-600 font-bold">Đăng nhập</Link>
      </p>
    </div>
  );
}