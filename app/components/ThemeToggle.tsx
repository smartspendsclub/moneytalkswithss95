'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Auto-enable dark mode on first visit
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      setTheme('dark'); // default theme
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-slate-600/40 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:border-slate-400 hover:bg-slate-900"
    >
      {theme === 'dark' ? '🌙 Dark' : '🌞 Light'}
    </button>
  );
}
