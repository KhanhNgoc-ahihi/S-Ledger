import type { Metadata } from 'next';
import './globals.css';
import Navigation from '../components/Navigation';
import AuthGuard from '../components/AuthGuard';

export const metadata: Metadata = {
  title: 'S-Ledger – Sổ Sách Số',
  description: 'Quản lý thu chi, công nợ và giao dịch đơn giản bằng giọng nói.',
  // Thêm dòng metadataBase này để Next.js định vị đúng trang web của bạn
  metadataBase: new URL('https://s-ledger-v2-h6wnigc6t-avengers-63e6.vercel.app'),
  openGraph: {
    title: 'S-Ledger – Sổ Sách Số',
    description: 'Quản lý thu chi, công nợ và giao dịch đơn giản bằng giọng nói.',
    url: 'https://s-ledger-v2-h6wnigc6t-avengers-63e6.vercel.app',
    siteName: 'S-Ledger',
    images: [
      {
        // Ghi thẳng link web + tên hình như thế này cho chắc ăn 100%
        url: 'https://s-ledger-v2-h6wnigc6t-avengers-63e6.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative">
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