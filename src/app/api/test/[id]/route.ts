import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { params } = await context;
  const test = await prisma.test.findUnique({ where: { id: Number(params.id) }, select: { id: true, title: true, description: true, image: true, questions: true, results: true } });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(test);
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { params } = await context;
  const body = await req.json();
  const test = await prisma.test.update({ where: { id: Number(params.id) }, data: body });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(test);
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { params } = await context;
  const test = await prisma.test.delete({ where: { id: Number(params.id) } });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 