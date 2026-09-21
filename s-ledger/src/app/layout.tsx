import type { Metadata } from 'next';
import './globals.css';
import Navigation from '../components/Navigation';
import AuthGuard from '../components/AuthGuard';

export const metadata: Metadata = {
  title: 'S-Ledger - Sổ Sách Số',
  description: 'Ứng dụng ghi sổ cho tiểu thương',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative">
          {/* Lính gác AuthGuard bọc toàn bộ nội dung web */}
          <AuthGuard>
            <main className="flex-1 pb-24 overflow-y-auto p-4">
              {children}
            </main>
            <Navigation />
          </AuthGuard>
        </div>
      </body>
    </html>
  );
}