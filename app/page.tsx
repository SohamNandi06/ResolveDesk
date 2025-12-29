import ComplaintForm from '@/components/ComplaintForm';
import NavbarActions from '@/components/NavbarActions'; // <--- Import this
import Link from 'next/link';
import { getUser } from '@/lib/get-user'; // <--- Import this

export default async function Home() {
  const user = await getUser(); // <--- Fetch user on server

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 selection:bg-indigo-500 selection:text-white">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        
        {/* Navbar */}
        <nav className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            
              
              <svg id="logo-89" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="ccustom" d="M39.9449 21.4998H32.8003C26.5594 21.4998 21.5003 26.559 21.5003 32.7998V39.9444C31.3502 39.214 39.2145 31.3497 39.9449 21.4998Z" fill="#775732"></path>
              <path className="ccustom" d="M18.5003 39.9444V32.7998C18.5003 26.559 13.4411 21.4998 7.20026 21.4998H0.0556641C0.785998 31.3497 8.65036 39.214 18.5003 39.9444Z" fill="#775732"></path>
              <path className="ccustom" d="M39.9449 18.4998C39.2145 8.64987 31.3502 0.78551 21.5003 0.0551758V7.19977C21.5003 13.4406 26.5594 18.4998 32.8003 18.4998H39.9449Z" fill="#775732"></path>
              <path className="ccustom" d="M18.5003 0.0551758C8.65036 0.78551 0.785998 8.64987 0.0556641 18.4998H7.20026C13.4411 18.4998 18.5003 13.4406 18.5003 7.19977V0.0551758Z" fill="#775732"></path>
              <path className="ccustom" d="M13.583 19.9998C16.3555 18.6145 18.615 16.355 20.0002 13.5825C21.3855 16.355 23.6449 18.6145 26.4175 19.9998C23.6449 21.385 21.3855 23.6445 20.0002 26.417C18.615 23.6445 16.3555 21.385 13.583 19.9998Z" fill="#CA9352"></path>
            </svg>
            
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              ResolveDesk
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Only show Admin Portal link if user is admin */}
             {user?.role === 'admin' && (
               <Link 
                 href="/admin" 
                 className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 font-medium text-sm hover:text-indigo-600 transition-colors"
               >
                 Admin Portal
               </Link>
             )}
             
             {/* Inject the Auth Buttons */}
             <NavbarActions user={user} />
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-4xl mx-auto px-6 pt-8 pb-20">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              Let&apos;s make things <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">better together.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Found a bug? Have a suggestion? We are listening. Submit your feedback below.
            </p>
          </div>

          <ComplaintForm />
        </main>
      </div>
    </div>
  );
}