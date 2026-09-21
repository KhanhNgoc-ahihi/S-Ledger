'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '../app/store/useStore';

const publicPaths = ['/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useStore((state: any) => state.currentUser);
  const [isClient, setIsClient] = useState(false);

  // Đảm bảo code chỉ chạy trên client để không lỗi giao diện Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const isPublicPath = publicPaths.includes(pathname);

    // Nếu chưa đăng nhập mà vào trang kín -> Đá ra login
    if (!currentUser && !isPublicPath) {
      router.push('/login');
    } 
    // Nếu đã đăng nhập mà vào lại login/register -> Đẩy vô trang chủ
    else if (currentUser && isPublicPath) {
      router.push('/');
    }
  }, [currentUser, pathname, isClient, router]);

  if (!isClient) return null; 

  // Trong lúc đang chờ đá ra login thì không hiện gì cả
  if (!currentUser && !publicPaths.includes(pathname)) return null;

  return <>{children}</>;
}