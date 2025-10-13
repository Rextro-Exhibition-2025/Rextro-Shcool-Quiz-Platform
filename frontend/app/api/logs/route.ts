import { NextResponse } from 'next/server';

// In-memory log store (replace with DB in production)
let suspiciousLogs: any[] = [];

export async function POST(request: Request) {
  const data = await request.json();
  const logEntry = { ...data, timestamp: new Date().toISOString() };
  suspiciousLogs.push(logEntry);
  // Terminal log for debugging
  // eslint-disable-next-line no-console
  console.log('[Suspicious Log]', JSON.stringify(logEntry, null, 2));
  return NextResponse.json({ success: true });
}

export async function GET() {
  // Return all logs
  return NextResponse.json(suspiciousLogs);
}
