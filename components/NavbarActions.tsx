'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  role: string;
}

export default function NavbarActions({ user }: { user: User | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    // Add a small loading feel or just redirect immediately
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  // 1. STATE: LOGGED IN (The "User Pill")
  if (user) {
    return (
      <div className="flex items-center gap-4">
        
        {/* User Profile Pill */}
        <div className="hidden md:flex items-center gap-3 pl-1 pr-4 py-1 bg-white/50 border border-slate-200 backdrop-blur-sm rounded-full shadow-sm transition-all hover:bg-white hover:shadow-md group cursor-default">
          
          {/* Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Text Info */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 leading-none">
              {user.name}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              {user.role}
            </span>
          </div>
        </div>

        {/* Logout Button (Styled as a "Ghost" button) */}
        <button 
          onClick={handleLogout}
          className="group flex items-center justify-center w-24 h-9 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
          title="Sign Out"
        >
          <svg className="w-4 h-4 mr-2 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>  <span>Logout</span>
        </button>
      </div>
    );
  }

  // 2. STATE: LOGGED OUT (The "Action" Button)
  return (
    <Link 
      href="/login"
      className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:shadow-slate-900/30 active:translate-y-0 active:scale-95"
    >
      <span className="relative z-10 text-sm font-semibold flex items-center gap-2">
        Sign In
        <svg className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </span>
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/10 transition-transform duration-300 ease-out"></div>
    </Link>
  );
}