import AdminTable from '@/components/AdminTable';
import NavbarActions from '@/components/NavbarActions';
import Link from 'next/link';
import { getUser } from '@/lib/get-user';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';


export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getUser();
  
  // 1. Fetch Real Stats
  await connectDB();
  const totalTickets = await Complaint.countDocuments();
  const pendingTickets = await Complaint.countDocuments({ status: 'Pending' });
  const resolvedTickets = await Complaint.countDocuments({ status: 'Resolved' });
  

  const completionRate = totalTickets > 0 
    ? Math.round((resolvedTickets / totalTickets) * 100) 
    : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-125 h-125 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-125 h-125 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              
               <svg id="logo-89" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="ccustom" d="M39.9449 21.4998H32.8003C26.5594 21.4998 21.5003 26.559 21.5003 32.7998V39.9444C31.3502 39.214 39.2145 31.3497 39.9449 21.4998Z" fill="#775732"></path>
              <path className="ccustom" d="M18.5003 39.9444V32.7998C18.5003 26.559 13.4411 21.4998 7.20026 21.4998H0.0556641C0.785998 31.3497 8.65036 39.214 18.5003 39.9444Z" fill="#775732"></path>
              <path className="ccustom" d="M39.9449 18.4998C39.2145 8.64987 31.3502 0.78551 21.5003 0.0551758V7.19977C21.5003 13.4406 26.5594 18.4998 32.8003 18.4998H39.9449Z" fill="#775732"></path>
              <path className="ccustom" d="M18.5003 0.0551758C8.65036 0.78551 0.785998 8.64987 0.0556641 18.4998H7.20026C13.4411 18.4998 18.5003 13.4406 18.5003 7.19977V0.0551758Z" fill="#775732"></path>
              <path className="ccustom" d="M13.583 19.9998C16.3555 18.6145 18.615 16.355 20.0002 13.5825C21.3855 16.355 23.6449 18.6145 26.4175 19.9998C23.6449 21.385 21.3855 23.6445 20.0002 26.417C18.615 23.6445 16.3555 21.385 13.583 19.9998Z" fill="#CA9352"></path>
            </svg>
              
              <div>
                <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-xs text-slate-500 font-medium">Manage Tickets & Feedback</p>
              </div>
            </div>

            <div className="flex items-center gap-4">

  <Link 
    href="/" 
    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm hover:bg-indigo-100 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
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