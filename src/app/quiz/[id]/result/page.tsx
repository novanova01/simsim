'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import styles from '../quiz.module.css';

interface Test {
  id: number;
  title: string;
  description: string;
  image?: string;
  results: Record<string, { short: string; detail: string }>;
}

export default function QuizResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;
  const rid = searchParams.get('rid');
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !rid) return;
    // 1. 결과 정보(rid)로 result row 조회
    fetch(`/api/result/byrid?rid=${rid}`)
      .then(res => res.ok ? res.json() : null)
      .then(async (data) => {
        if (!data || !data.result || !data.testId) {
          setError('결과를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }
        setResultKey(data.result);
        // 2. 해당 테스트 정보 조회
        const testRes = await fetch(`/api/test/${data.testId}`);
        if (!testRes.ok) {
          setError('테스트 정보를 불러올 수 없습니다.');
          setLoading(false);
          return;
        }
        const testData = await testRes.json();
        setTest(testData);
        setLoading(false);
      });
  }, [id, rid]);

  if (loading) return <main className={styles.main}><div>로딩 중...</div></main>;
  if (error) return <main className={styles.main}><div style={{color:'#ff61a6', fontWeight:600}}>{error}</div></main>;
  if (!test || !resultKey) return <main className={styles.main}><div>결과 데이터가 없습니다.</div></main>;

  return (
    <main className={styles.main}>
      <div className={styles.title}>{test.title}</div>
      <div className={styles.resultBox}>
        <div className={styles.resultTitle}>{test.results[resultKey]?.short}</div>
        <div className={styles.resultText}>{test.results[resultKey]?.detail}</div>
      </div>
    </main>
  );
} 