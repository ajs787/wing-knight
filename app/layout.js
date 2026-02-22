import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'WingRU — AI-Powered Compatibility Engine',
  description: 'Trust-validated social matching powered by Gemini AI.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-bg font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
