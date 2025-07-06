import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function GET() {
  const results = await prisma.result.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rid = randomUUID();
  const result = await prisma.result.create({ data: { ...body, rid } });
  return NextResponse.json({ rid });
} 