import ComplaintForm from '@/components/ComplaintForm';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <nav className="flex justify-end mb-8">
        <Link href="/admin" className="text-blue-600 underline">
          Admin Dashboard
        </Link>
      </nav>
      <ComplaintForm />
    </main>
  );
}