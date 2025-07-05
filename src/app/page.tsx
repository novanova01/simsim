'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './main.module.css';

interface Test {
  _id: string;
  title: string;
  description: string;
  image?: string;
}

const dummyTests = [
  { id: 1, title: '나의 도트 캐릭터 유형', subtitle: '도트 세계에서 나는 어떤 모습일까?' },
  { id: 2, title: 'MBTI 도트 동물', subtitle: '나와 닮은 도트 동물은?' },
  { id: 3, title: '도트 연애 스타일', subtitle: '연애할 때 나는 어떤 타입?' },
  { id: 4, title: '도트 직업 테스트', subtitle: '나에게 어울리는 도트 직업은?' },
  { id: 5, title: '도트 친구 유형', subtitle: '내가 친구라면 어떤 스타일?' },
  { id: 6, title: '도트 여행지 추천', subtitle: '나에게 어울리는 여행지는?' },
  { id: 7, title: '도트 음식 취향', subtitle: '내가 좋아할 도트 음식은?' },
  { id: 8, title: '도트 동물상 테스트', subtitle: '나는 어떤 동물상?' },
  { id: 9, title: '도트 성격 유형', subtitle: '나의 도트 성격은?' },
  { id: 10, title: '도트 취미 테스트', subtitle: '나에게 맞는 도트 취미는?' },
];

export default function Home() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
        setTests(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.logoBox}>
          <span className={styles.dotLogo}>SIMSIM</span>
        </div>
        <div className={styles.headerSub}>심리테스트 & 도트게임 컬렉션</div>
        <nav className={styles.headerNav}>
          <span className={styles.headerNavItem}>전체 테스트</span>
          <span className={styles.headerNavItem}>인기</span>
          <span className={styles.headerNavItem}>카테고리</span>
          <input className={styles.headerSearch} placeholder="테스트 검색" />
          <span className={styles.headerUser} title="로그인/프로필">👤</span>
        </nav>
      </header>
      {/* 테스트 리스트 */}
      <section className={styles.testListSection}>
        <div className={styles.testListGrid}>
          {dummyTests.map((test, idx) => (
            idx < 4 ? (
              <Link href={`/quiz/${test.id}`} key={test.id} className={styles.testCard}>
                <div className={styles.testThumb} />
                <div className={styles.testTextBox}>
                  <h3 className={styles.testTitle}>{test.title}</h3>
                  <p className={styles.testSubtitle}>{test.subtitle}</p>
                </div>
              </Link>
            ) : (
              <div className={styles.testCard + ' ' + styles.testCardDisabled} key={test.id}>
                <div className={styles.testThumb} />
                <div className={styles.testTextBox}>
                  <h3 className={styles.testTitle}>{test.title}</h3>
                  <p className={styles.testSubtitle}>{test.subtitle}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </section>
    </div>
  );
}
