import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // prisma 클라이언트 import 경로는 프로젝트에 맞게 수정

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const testId = Number(params.testId);
    
    if (isNaN(testId)) {
      return NextResponse.json({ error: 'Invalid testId' }, { status: 400 });
    }

    const stats = await prisma.result.groupBy({
      by: ['result'],
      where: { testId },
      _count: { result: true },
      orderBy: { _count: { result: 'desc' } },
    });

    console.log('groupBy 결과:', stats);
    const formatted = stats.map((s) => ({
      _id: s.result,
      count: s._count.result,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API /api/result/[testId] GET error:', error);
    
    console.log('groupBy 결과:');
    return NextResponse.json(
      
      { error: 'Internal Server Error', detail: (error as Error).message },
      { status: 500 }
    );
  }
}