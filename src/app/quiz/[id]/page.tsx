'use client';
import React, { useState, useEffect } from 'react';
import styles from './quiz.module.css';
import { useParams, notFound, useRouter } from 'next/navigation';

interface Test {
  _id: string;
  title: string;
  questions: {
    question: string;
    options: { text: string; result: string }[];
  }[];
  results: Record<string, string>;
}

interface Stat {
  _id: string;
  count: number;
}

export default function QuizDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<Stat[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/test/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setTest(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (showResult && id) {
      fetch(`/api/result/${id}/stats`)
        .then(res => res.json())
        .then(setStats);
    }
  }, [showResult, id]);

  if (!loading && !test) return notFound();
  if (loading || !test) return <main className={styles.main}><div>로딩 중...</div></main>;

  const handleAnswer = (result: string) => {
    const nextAnswers = [...answers, result];
    setAnswers(nextAnswers);
    if (step + 1 < test.questions.length) {
      setStep(step + 1);
    } else {
      setSaving(true);
      // 결과 저장
      const resultKey = getResult(nextAnswers);
      fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: id, answers: nextAnswers, result: resultKey }),
      })
        .then(res => {
          setSaving(false);
          if (!res.ok) throw new Error('저장 실패');
          setShowResult(true);
        })
        .catch(() => {
          setError('결과 저장에 실패했습니다.');
          setShowResult(true);
        });
    }
  };

  const getResult = (arr = answers): keyof typeof test.results => {
    const freq: Record<string, number> = {};
    arr.forEach((r) => (freq[r] = (freq[r] || 0) + 1));
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] as keyof typeof test.results;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: test.title,
        text: '내 심리테스트 결과를 확인해보세요!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  const handleKakaoShare = () => {
    window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(window.location.href)}`);
  };

  return (
    <div style={{padding:'48px 0', textAlign:'center'}}>
      <h1 style={{fontSize:'2rem', fontWeight:700, marginBottom:24}}>퀴즈 {params.id} 상세페이지</h1>
      <button style={{padding:'10px 24px', borderRadius:8, background:'#7f9cf5', color:'#fff', border:'none', fontWeight:600, fontSize:'1rem', cursor:'pointer'}} onClick={() => router.back()}>
        돌아가기
      </button>
    </div>
  );
} 