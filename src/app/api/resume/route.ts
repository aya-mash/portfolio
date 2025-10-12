import { NextResponse } from 'next/server';
import { loadResume } from '@/lib/resume';

export function GET() {
  const data = loadResume();
  return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
}
