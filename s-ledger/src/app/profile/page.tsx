'use client';
import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useRouter } from 'next/navigation';
import { LogOut, Save, User, Camera } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = useStore((state: any) => state.currentUser);
  const updateProfile = useStore((state: any) => state.updateProfile);
  const logoutUser = useStore((state: any) => state.logoutUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    shopName: currentUser?.shopName || '',
    storeScale: currentUser?.storeScale || 'Bán lẻ/Nhỏ',
    businessType: currentUser?.businessType || '',
    avatar: currentUser?.avatar || '',
  });
  const [message, setMessage] = useState('');

  if (!currentUser) return null;

  // Xử lý khi người dùng chọn ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file); // Mã hóa ảnh thành chuỗi Base64 để lưu ở MVP
    }
  };

  const handleSave = () => {
    updateProfile(formData);
    setMessage('Đã lưu thông tin thành công!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <div className="space-y-6 pt-2 pb-10">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <User className="w-6 h-6 text-green-600" /> Hồ sơ chủ quán
      </h1>

      <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
        {/* Phần Avatar */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full bg-gray-100 border-4 border-green-100 overflow-hidden cursor-pointer flex items-center justify-center group"
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-300" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Chạm để đổi ảnh</p>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>

        {message && <p className="text-green-600 text-sm bg-green-50 p-2 rounded text-center">{message}</p>}
        
        {/* Các Form nhập liệu giữ nguyên */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
          <input type="text" disabled value={currentUser.phone} className="w-full p-3 border rounded-xl bg-gray-50 text-gray-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Họ và tên chủ quán</label>
          <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tên cửa hàng</label>
          <input type="text" value={formData.shopName} onChange={(e) => setFormData({...formData, shopName: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1">Quy mô</label>
            <select value={formData.storeScale} onChange={(e) => setFormData({...formData, storeScale: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white">
              <option value="Bán lẻ/Nhỏ">Bán lẻ/Nhỏ</option>
              <option value="Bán buôn/Lớn">Bán buôn/Lớn</option>
              <option value="Chuỗi">Chuỗi</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1">Lĩnh vực</label>
            <input type="text" value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-green-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 mt-2">
          <Save className="w-5 h-5" /> Lưu thay đổi
        </button>
      </div>

      <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100">
        <LogOut className="w-5 h-5" /> Đăng xuất
      </button>
    </div>
  );
}