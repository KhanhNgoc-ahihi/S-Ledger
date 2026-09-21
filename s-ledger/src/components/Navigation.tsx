'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Calculator, User, CalendarDays } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  
  // Ẩn thanh menu nếu đang ở màn hình đăng nhập hoặc đăng ký
  if (pathname === '/login' || pathname === '/register') return null;

  // Danh sách các nút dưới đáy màn hình (Đã thêm CalendarDays cho Lịch trình)
  const navItems = [
    { href: '/', icon: Home, label: 'Trang chủ' },
    { href: '/schedule', icon: CalendarDays, label: 'Lịch trình' },
    { href: '/transactions', icon: List, label: 'Giao dịch' },
    { href: '/debts', icon: Calculator, label: 'Công nợ' },
    { href: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full bg-white border-t rounded-b-3xl shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-green-600 bg-green-50 scale-110' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}