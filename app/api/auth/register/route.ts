import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/Users';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';      // <--- Added
import { cookies } from 'next/headers'; // <--- Added

export async function POST(req: Request) {
  await connectDB();
  try {
    const { name, email, password, adminCode } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = adminCode === 'admin123' ? 'admin' : 'user';

    // 1. Create User
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // 2. Generate JWT (Auto-Login Logic)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: newUser._id, role: newUser.role, name: newUser.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret);

    // 3. Set Cookie immediately
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    return NextResponse.json({ 
      message: 'User created & logged in', 
      user: { role: newUser.role } // Send role back so frontend knows where to redirect
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}