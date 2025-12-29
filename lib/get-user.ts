import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}