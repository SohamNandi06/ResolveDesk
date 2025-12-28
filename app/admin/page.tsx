import AdminTable from '@/components/AdminTable';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link href="/" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            Back to Home
          </Link>
        </div>
        <AdminTable />
      </div>
    </main>
  );
}