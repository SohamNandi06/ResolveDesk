import AdminTable from '@/components/AdminTable';
import NavbarActions from '@/components/NavbarActions';
import Link from 'next/link';
import { getUser } from '@/lib/get-user';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';

// Force dynamic to ensure stats update on every refresh
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getUser();
  
  // 1. Fetch Real Stats
  await connectDB();
  const totalTickets = await Complaint.countDocuments();
  const pendingTickets = await Complaint.countDocuments({ status: 'Pending' });
  const resolvedTickets = await Complaint.countDocuments({ status: 'Resolved' });
  
  // Calculate a simple "Health" percentage
  const completionRate = totalTickets > 0 
    ? Math.round((resolvedTickets / totalTickets) * 100) 
    : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-xs text-slate-500 font-medium">Manage Tickets & Feedback</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Go to Portal
              </Link>
              <div className="h-6 w-px bg-slate-300 hidden md:block"></div>
              <NavbarActions user={user} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          
          {/* REAL STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Card 1: Total */}
            <div className="bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl ring-1 ring-blue-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Tickets</p>
                  <h3 className="text-3xl font-black text-slate-800">{totalTickets}</h3>
                </div>
              </div>
            </div>

            {/* Card 2: Pending (Action Required) */}
            <div className="bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ring-1 ${pendingTickets > 0 ? 'bg-amber-50 text-amber-600 ring-amber-100' : 'bg-emerald-50 text-emerald-600 ring-emerald-100'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Pending Action</p>
                  <h3 className="text-3xl font-black text-slate-800">{pendingTickets}</h3>
                </div>
              </div>
            </div>

            {/* Card 3: Completion Rate */}
            <div className="bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-emerald-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Resolved Rate</p>
                  <h3 className="text-3xl font-black text-slate-800">{completionRate}%</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <AdminTable />
        </main>
      </div>
    </div>
  );
}