import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rid = searchParams.get('rid');
  if (!rid) return NextResponse.json({ error: 'no rid' }, { status: 400 });
  const row = await prisma.result.findUnique({ where: { rid } });
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ testId: row.testId, result: row.result });
} 