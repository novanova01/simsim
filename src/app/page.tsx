'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './main.module.css';

interface Test {
  id: number;
  title: string;
  description: string;
  image?: string;
}

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
          {loading ? (
            <div>로딩 중...</div>
          ) : tests.length === 0 ? (
            <div>등록된 테스트가 없습니다.</div>
          ) : (
            tests.map((test) => (
              <Link href={`/quiz/${test.id}`} key={test.id} className={styles.testCard} style={{textDecoration:'none'}}>
                <div
                  className={styles.testThumb}
                  style={test.image ? { backgroundImage: `url(${test.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!test.image && (
                    <span style={{color:'#bbb', fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>이미지 없음</span>
                  )}
                </div>
                <div className={styles.testTextBox} style={{alignItems:'center', textAlign:'center'}}>
                  <h3 className={styles.testTitle}>{test.title}</h3>
                  <p className={styles.testSubtitle}>{test.description}</p>
                  <button style={{marginTop:16, padding:'8px 24px', borderRadius:8, background:'#7f9cf5', color:'#fff', border:'none', fontWeight:600, fontSize:'1rem', cursor:'pointer'}}>테스트 시작</button>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
