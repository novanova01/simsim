import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';

const sampleTests = [
  {
    title: '연애 유형 테스트',
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
    title: 'MBTI 심리테스트',
    description: '나의 성격 유형은?',
    image: '/dot-mbti.png',
    questions: [
      {
        question: '친구들과 있을 때 나는?',
        options: [
          { text: '리더 역할', result: 'E' },
          { text: '조용히 관찰', result: 'I' },
        ],
      },
      {
        question: '계획 세우는 걸 좋아하나요?',
        options: [
          { text: '네', result: 'J' },
          { text: '아니오', result: 'P' },
        ],
      },
    ],
    results: {
      E: '외향적 유형',
      I: '내향적 유형',
      J: '계획형',
      P: '즉흥형',
    },
  },
  {
    title: '우울증 자가진단',
    description: '내 마음의 건강 체크!',
    image: '/dot-mind.png',
    questions: [
      {
        question: '최근 2주간 슬펐던 적이 있나요?',
        options: [
          { text: '자주', result: 'Y' },
          { text: '거의 없음', result: 'N' },
        ],
      },
      {
        question: '잠을 잘 못 잔 적이 있나요?',
        options: [
          { text: '네', result: 'Y' },
          { text: '아니오', result: 'N' },
        ],
      },
    ],
    results: {
      Y: '우울감이 있을 수 있음',
      N: '정상 범위',
    },
  },
];

export async function GET() {
  await dbConnect();
  const tests = await Test.find({}, 'title description image').sort({ createdAt: -1 });
  return NextResponse.json(tests);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  if (searchParams.get('sample') === '1') {
    // 샘플 데이터 여러 개 추가
    const inserted = await Test.insertMany(sampleTests);
    return NextResponse.json(inserted);
  }
  const body = await req.json();
  const test = await Test.create(body);
  return NextResponse.json(test);
} 