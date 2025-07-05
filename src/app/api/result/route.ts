import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';

export async function GET() {
  await dbConnect();
  const results = await Result.find({}).sort({ createdAt: -1 });
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const result = await Result.create(body);
  return NextResponse.json(result);
} 