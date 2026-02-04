import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'MoneyTalks with SS – Financial Planning Tools & Insights',
  description:
    'Premium, easy-to-use financial planning tools and guidance by Sai Srinivas Guduru – focusing on SIPs, investments, retirement and goal-based planning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ADD THE ATTRIBUTE BELOW TO THE HTML TAG
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-50">
        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <Navbar />

        <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}