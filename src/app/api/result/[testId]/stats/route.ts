import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { testId: string } }) {
  const stats = await prisma.result.groupBy({
    by: ['result'],
    where: { testId: Number(params.testId) },
    _count: { result: true },
    orderBy: { _count: { result: 'desc' } },
  });
  // Prisma groupBy 결과를 기존 MongoDB aggregate와 비슷하게 변환
  const formatted = stats.map((s: { result: string; _count: { result: number } }) => ({ _id: s.result, count: s._count.result }));
  return NextResponse.json(formatted);
} 