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
    <main className={styles.main}>
      <h1 className={styles.title}>도트 심리테스트</h1>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <div className={styles.grid}>
          {tests.map((test) => (
            <Link href={`/quiz/${test._id}`} key={test._id} className={styles.card}>
              {test.image && <img src={test.image} alt={test.title} className={styles.img} />}
              <h2>{test.title}</h2>
              <p>{test.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
