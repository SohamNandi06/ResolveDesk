'use client';
import { useState } from 'react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Product',
    priority: 'Low',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch('/api/complaints', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setSuccess(true);
      setFormData({ title: '', description: '', category: 'Product', priority: 'Low' });
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="relative group">
      {/* Glowing background effect behind the form */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      {/* The Glass Card */}
      <div className="relative bg-white/70 backdrop-blur-xl border border-white/50 p-8 md:p-10 rounded-3xl shadow-2xl ring-1 ring-black/5">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Success Message Banner */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${success ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-100 flex items-center gap-3 shadow-sm">
              <div className="bg-emerald-100 p-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="font-semibold text-sm">Ticket submitted successfully!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Select */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
              <div className="relative group/select">
                <select 
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm group-hover/select:border-indigo-300 font-medium"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Product">📦 Product Issue</option>
                  <option value="Service">🛠 Service Request</option>
                  <option value="Support">📞 Customer Support</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Priority Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Priority</label>
              <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
                {['Low', 'Medium', 'High'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                      formData.priority === p
                        ? 'bg-white text-indigo-600 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/5 scale-[1.02]'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Subject</label>
            <input 
              type="text" 
              required
              placeholder="What seems to be the problem?"
              className="w-full bg-white border border-slate-200 text-slate-900 text-lg font-medium placeholder:text-slate-300 placeholder:font-normal rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
            <textarea 
              required
              placeholder="Tell us more about what happened..."
              className="w-full bg-white border border-slate-200 text-slate-900 text-base leading-relaxed placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm min-h-[160px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Action Button */}
          <button 
            disabled={loading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Sending Ticket...' : 'Submit Ticket'}
              {!loading && (
                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              )}
            </span>
            {/* Shimmer effect on button */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out"></div>
          </button>

        </form>
      </div>
    </div>
  );
}