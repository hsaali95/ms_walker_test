import { NextResponse } from 'next/server';
// import '@/utils/crone-job'; // Import the cron job file

export async function GET() {
  return NextResponse.json({ message: 'Cron job initialized!' });
}