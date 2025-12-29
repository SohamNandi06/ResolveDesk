'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Complaint {
  _id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  dateSubmitted: string;
  userName?: string;
}

export default function AdminTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  
  // FIX 1: Initialize loading to true so we don't need to set it in useEffect
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  // FIX 2: Define and call the fetch logic entirely inside useEffect
// ... inside the useEffect ...

useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch('/api/complaints', { cache: 'no-store' });
        
        // DEBUGGING BLOCK START
        if (!res.ok) {
            // If status is 404, 500, etc., don't try to parse JSON
            const errorText = await res.text();
            console.error("❌ API Error:", res.status, errorText);
            setLoading(false);
            return;
        }
        // DEBUGGING BLOCK END

        const data = await res.json();
        setComplaints(data);
      } catch (error) {
        console.error("❌ Network or Parsing Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));

    await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
      headers: { 'Content-Type': 'application/json' },
    });

    router.refresh(); 
  };

  const deleteComplaint = async (id: string) => {
    if (!confirm('Delete this ticket permanently?')) return;
    
    setComplaints(prev => prev.filter(c => c._id !== id));
    
    await fetch(`/api/complaints/${id}`, { method: 'DELETE' });

    router.refresh();
  };

  const filteredComplaints = complaints.filter(c => 
    (filter.status ? c.status === filter.status : true) &&
    (filter.priority ? c.priority === filter.priority : true)
  );

  // --- STYLES ---
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Resolved': return { text: 'text-emerald-700', bg: 'bg-emerald-100', dot: 'bg-emerald-600' };
      case 'In Progress': return { text: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-600' };
      default: return { text: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-600' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'text-red-600 font-bold';
      case 'Medium': return 'text-orange-600 font-semibold';
      default: return 'text-slate-600 font-medium';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      
      {/* HEADER & FILTERS */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">Feedback Overview</h2>
        
        <div className="flex gap-3">
          <select 
            className="pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select 
            className="pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
            onChange={(e) => setFilter({...filter, priority: e.target.value})}
          >
            <option value="">Priority: All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-3 pl-6 pr-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[30%]">Issue Details</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Priority</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Raised By</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 pr-6 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan={7} className="p-12 text-center text-slate-500">Loading data...</td></tr>
            ) : filteredComplaints.map((c) => {
              const statusStyle = getStatusConfig(c.status);
              return (
                <tr key={c._id} className="hover:bg-slate-50 transition-colors group">
                  
                  {/* Title & Desc */}
                  <td className="py-3 pl-6 pr-4 align-top">
                    <div>
                      <p className="text-slate-900 font-semibold text-base mb-1">{c.title}</p>
                      <p className="text-slate-600 text-sm leading-snug line-clamp-2 max-w-lg">
                        {c.description}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 align-top">
                    <span className="text-sm text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded">
                      {c.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3 align-top">
                    <span className={`text-sm ${getPriorityColor(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>

                  {/* Raised By */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {c.userName ? c.userName.charAt(0).toUpperCase() : 'A'}
                       </div>
                       <span className="text-sm font-medium text-slate-700">
                         {c.userName || 'Anonymous'}
                       </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 align-top">
                    <span className="text-sm text-slate-600 whitespace-nowrap">
                      {new Date(c.dateSubmitted).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-4 py-3 align-top">
                    <div className="relative inline-block w-36">
                      <div className={`flex items-center w-full rounded-md border-0 py-1.5 pl-3 pr-8 ${statusStyle.bg}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${statusStyle.dot}`}></div>
                        <select 
                          value={c.status}
                          onChange={(e) => updateStatus(c._id, e.target.value)}
                          className={`w-full bg-transparent text-sm font-semibold cursor-pointer focus:outline-none appearance-none ${statusStyle.text}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${statusStyle.text}`}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </td>

                  {/* Delete Action */}
                  <td className="px-4 py-3 pr-6 align-top text-right">
                    <button 
                      onClick={() => deleteComplaint(c._id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredComplaints.length === 0 && !loading && (
          <div className="p-8 text-center border-t border-slate-200">
            <p className="text-slate-500 text-base">No tickets found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}