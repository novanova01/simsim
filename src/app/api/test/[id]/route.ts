import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const test = await Test.findById(params.id);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(test);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const test = await Test.findByIdAndUpdate(params.id, body, { new: true });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(test);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const test = await Test.findByIdAndDelete(params.id);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 