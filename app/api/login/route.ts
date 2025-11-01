import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import cookie from 'cookie';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === process.env.PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.headers.set(
      'Set-Cookie',
      cookie.serialize('password', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      })
    );
    return response;
  }

  return NextResponse.json(
    { success: false, message: 'Incorrect password' },
    { status: 401 }
  );
}
