import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const test = await prisma.test.findUnique({ where: { id: Number(params.id) } });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(test);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const test = await prisma.test.update({ where: { id: Number(params.id) }, data: body });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(test);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const test = await prisma.test.delete({ where: { id: Number(params.id) } });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 