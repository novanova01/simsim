import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.test.deleteMany(); // 기존 데이터 모두 삭제

  await prisma.test.createMany({
    data: [
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
          A: { short: '차분한 도트', detail: '당신은 차분하고 신중한 성격입니다. 주변에서 신뢰받는 타입이에요!' },
          B: { short: '활발한 도트', detail: '당신은 활발하고 긍정적인 에너지가 넘치는 타입입니다. 모두에게 활력을 줍니다!' },
          C: { short: '엉뚱한 도트', detail: '당신은 엉뚱하고 창의적인 아이디어가 많은 타입입니다. 주변을 즐겁게 만듭니다!' },
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
          A: { short: '배려형 연애', detail: '상대방을 잘 챙기고 배려하는 연애 스타일입니다. 안정적인 관계를 선호해요.' },
          B: { short: '자유로운 연애', detail: '즉흥적이고 자유로운 연애를 즐깁니다. 새로운 경험을 좋아해요!' },
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
          A: { short: '이과/공대 계열', detail: '분석적이고 논리적인 사고를 가진 당신에게 이과/공대 계열이 잘 어울립니다.' },
          B: { short: '예체능 계열', detail: '창의적이고 감각적인 당신에게 예체능 계열이 잘 어울립니다.' },
          C: { short: '인문/사회 계열', detail: '사람과 사회에 관심이 많은 당신에게 인문/사회 계열이 잘 어울립니다.' },
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
          A: { short: '상식왕!', detail: '정답률이 매우 높아요! 다양한 분야에 대한 지식이 풍부합니다.' },
          B: { short: '조금 더 공부해봐요!', detail: '아직 부족한 부분이 있지만, 앞으로 더 성장할 수 있습니다!' },
        },
      },
    ],
  });

  console.log('샘플 테스트 데이터 등록 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 