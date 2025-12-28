'use client';
import { useState, useEffect } from 'react';

interface Complaint {
  _id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  dateSubmitted: string;
}

export default function AdminTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState({ status: '', priority: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const res = await fetch('/api/complaints');
    const data = await res.json();
    setComplaints(data);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchComplaints();
  };

  const deleteComplaint = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
    fetchComplaints();
  };

  const filteredComplaints = complaints.filter(c => 
    (filter.status ? c.status === filter.status : true) &&
    (filter.priority ? c.priority === filter.priority : true)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <select 
          className="border p-2 rounded" 
          onChange={(e) => setFilter({...filter, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        
        <select 
          className="border p-2 rounded"
          onChange={(e) => setFilter({...filter, priority: e.target.value})}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Priority</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="p-3 border-b font-medium">{c.title}</td>
                <td className="p-3 border-b">{c.category}</td>
                <td className="p-3 border-b">
                  <span className={`px-2 py-1 rounded text-sm ${
                    c.priority === 'High' ? 'bg-red-100 text-red-800' :
                    c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {c.priority}
                  </span>
                </td>
                <td className="p-3 border-b">{new Date(c.dateSubmitted).toLocaleDateString()}</td>
                <td className="p-3 border-b">
                  <select 
                    value={c.status}
                    onChange={(e) => updateStatus(c._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="p-3 border-b">
                  <button 
                    onClick={() => deleteComplaint(c._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}