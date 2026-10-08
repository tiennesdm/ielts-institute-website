import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b2545',
};

export const metadata = {
  title: 'First Class Global Education | 8+ Bands IELTS, PTE & Study Abroad Coaching',
  description: 'First Class Global Education - Premier IELTS, PTE & Spoken English Institute. Daily 1-on-1 speaking, CD-IELTS computer lab, Cambridge certified trainers and verified 8+ band results.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-clip">
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col overflow-x-clip w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
