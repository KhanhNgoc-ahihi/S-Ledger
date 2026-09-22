'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '../app/store/useStore';
import { Loader2 } from 'lucide-react'; // Thêm icon loading cho đẹp

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state: any) => state.currentUser);
  const router = useRouter();
  const pathname = usePathname();
  
  // State này để ép hệ thống ĐỢI load xong bộ nhớ trình duyệt mới chạy
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Nếu chưa load xong bộ nhớ thì khoan làm gì cả

    const isAuthPage = pathname === '/login' || pathname === '/register';

    // Chưa đăng nhập mà rớ vào trang trong -> Đá ra login
    if (!currentUser && !isAuthPage) {
      router.replace('/login'); 
    } 
    // Đã đăng nhập rồi mà lởn vởn ở trang login/register -> Đẩy vô trong
    else if (currentUser && isAuthPage) {
      router.replace('/schedule'); 
    }
  }, [currentUser, isMounted, pathname, router]);

  // Trong tích tắc đợi móc dữ liệu từ LocalStorage, hiện loading nhẹ nhàng
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return <>{children}</>;
}