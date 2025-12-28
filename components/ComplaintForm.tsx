'use client';
import {useState} from 'react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Product',
    priority: 'Low',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch('/api/complaints', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    setLoading(false);
    alert('Complaint Submitted Successfully');
    setFormData({ title: '', description: '', category: 'Product', priority: 'Low' });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Submit a Complaint</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Title</label>
        <input 
          type="text" 
          required
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Category</label>
        <select 
          className="w-full p-2 border rounded"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        >
          <option value="Product">Product</option>
          <option value="Service">Service</option>
          <option value="Support">Support</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Priority</label>
        <div className="flex gap-4">
          {['Low', 'Medium', 'High'].map((p) => (
            <label key={p} className="flex items-center">
              <input 
                type="radio" 
                name="priority" 
                value={p}
                checked={formData.priority === p}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="mr-2"
              />
              {p}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea 
          required
          className="w-full p-2 border rounded h-24"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <button 
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
}