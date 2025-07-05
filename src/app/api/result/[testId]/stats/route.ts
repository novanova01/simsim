import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';

export async function GET(req: NextRequest, { params }: { params: { testId: string } }) {
  await dbConnect();
  const stats = await Result.aggregate([
    { $match: { testId: params.testId } },
    { $group: { _id: '$result', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  return NextResponse.json(stats);
} 