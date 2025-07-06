import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const sampleTests = [
  {
    title: '나의 도트 캐릭터 유형',
    description: '도트 세계에서 나는 어떤 모습일까? 나만의 도트 캐릭터를 찾아보세요!',
    image: '/dot-char.png',
    questions: [
      {
        question: '좋아하는 색은?',
        options: [
          { text: '파랑', result: 'A' },
          { text: '노랑', result: 'B' },
          { text: '분홍', result: 'C' },
        ],
      },
      {
        question: '성격을 한마디로 표현하면?',
        options: [
          { text: '차분함', result: 'A' },
          { text: '활발함', result: 'B' },
          { text: '엉뚱함', result: 'C' },
        ],
      },
    ],
    results: {
      A: '차분한 도트 캐릭터',
      B: '활발한 도트 캐릭터',
      C: '엉뚱한 도트 캐릭터',
    },
  },
  {
    title: '연애성향 테스트',
    description: '당신의 연애 스타일을 알아보세요!',
    image: '/dot-love.png',
    questions: [
      {
        question: '데이트할 때 가장 중요한 것은?',
        options: [
          { text: '대화', result: 'A' },
          { text: '이벤트', result: 'B' },
        ],
      },
      {
        question: '연인과의 여행 스타일은?',
        options: [
          { text: '계획형', result: 'A' },
          { text: '즉흥형', result: 'B' },
        ],
      },
    ],
    results: {
      A: '배려형 연애 스타일',
      B: '자유로운 연애 스타일',
    },
  },
  {
    title: '대학학과테스트',
    description: '나에게 어울리는 대학 학과는?',
    image: '/dot-uni.png',
    questions: [
      {
        question: '관심 있는 분야는?',
        options: [
          { text: '과학/공학', result: 'A' },
          { text: '예술/디자인', result: 'B' },
          { text: '인문/사회', result: 'C' },
        ],
      },
      {
        question: '선호하는 활동은?',
        options: [
          { text: '실험/분석', result: 'A' },
          { text: '창작/표현', result: 'B' },
          { text: '토론/글쓰기', result: 'C' },
        ],
      },
    ],
    results: {
      A: '이과/공대 계열',
      B: '예체능 계열',
      C: '인문/사회 계열',
    },
  },
  {
    title: '상식테스트',
    description: '당신의 상식 점수는 몇 점일까요?',
    image: '/dot-quiz.png',
    questions: [
      {
        question: '지구에서 가장 큰 동물은?',
        options: [
          { text: '코끼리', result: 'B' },
          { text: '흰수염고래', result: 'A' },
          { text: '기린', result: 'B' },
        ],
      },
      {
        question: '대한민국의 수도는?',
        options: [
          { text: '서울', result: 'A' },
          { text: '부산', result: 'B' },
        ],
      },
    ],
    results: {
      A: '상식왕! 정답률 높음',
      B: '조금 더 공부해봐요!',
    },
  },
];

export async function GET() {
  const tests = await prisma.test.findMany({
    select: { id: true, title: true, description: true, image: true, questions: true, results: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(tests);
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('sample') === '1') {
    // 샘플 데이터 여러 개 추가 (중복 title이면 무시)
    for (const test of sampleTests) {
      await prisma.test.upsert({
        where: { title: test.title },
        update: {},
        create: test,
      });
    }
    const all = await prisma.test.findMany({
      select: { id: true, title: true, description: true, image: true, questions: true, results: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(all);
  }
  const body = await req.json();
  const test = await prisma.test.create({ data: body });
  return NextResponse.json(test);
} 