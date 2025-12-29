import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // FIX IS HERE: Await the cookies() function
  (await cookies()).delete('token');
  
  return NextResponse.json({ message: 'Logged out' });
}