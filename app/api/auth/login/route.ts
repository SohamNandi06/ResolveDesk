import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/Users';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  await connectDB();
  try {
    const { email, password } = await req.json();
    
    // DEBUG LOG 1: Check what is being received
    console.log("Login attempt for email:", email);

    // 1. Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      // DEBUG LOG 2: User not found
      console.log("❌ User not found in database.");
      return NextResponse.json({ error: 'Invalid credentials (User not found)' }, { status: 401 });
    }

    // DEBUG LOG 3: User found, checking password
    console.log("✅ User found. Role:", user.role);

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // DEBUG LOG 4: Password wrong
      console.log("❌ Password mismatch.");
      return NextResponse.json({ error: 'Invalid credentials (Password wrong)' }, { status: 401 });
    }

    // 3. Create Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user._id, role: user.role, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret);

    // 4. Set Cookie
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    console.log("✅ Login successful");
    return NextResponse.json({ 
      message: 'Login successful', 
      user: { name: user.name, role: user.role } 
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}