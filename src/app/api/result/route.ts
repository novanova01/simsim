import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const results = await prisma.result.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await prisma.result.create({ data: body });
  return NextResponse.json(result);
} 