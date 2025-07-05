'use client';
import React, { useState, useEffect } from 'react';
import styles from './quiz.module.css';
import { useParams, notFound } from 'next/navigation';

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

export default function QuizDetail() {
  const params = useParams();
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
    <main className={styles.main}>
      <h1 className={styles.title}>{test.title}</h1>
      {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
      {!showResult ? (
        <div className={styles.quizBox}>
          <div className={styles.question}>{test.questions[step].question}</div>
          <div className={styles.options}>
            {test.questions[step].options.map((opt, idx) => (
              <button key={idx} className={styles.optionBtn} onClick={() => handleAnswer(opt.result)} disabled={saving}>
                {opt.text}
              </button>
            ))}
          </div>
          <div className={styles.progress}>{step + 1} / {test.questions.length}</div>
        </div>
      ) : (
        <div className={styles.resultBox}>
          <div className={styles.resultTitle}>결과</div>
          <div className={styles.resultText}>{test.results[getResult()]}</div>
          <button className={styles.retryBtn} onClick={() => { setStep(0); setAnswers([]); setShowResult(false); setError(''); }}>다시하기</button>
          <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'center'}}>
            <button className={styles.addBtn} onClick={handleShare}>공유하기</button>
            <button className={styles.addBtn} onClick={handleKakaoShare}>카카오톡</button>
          </div>
          <div style={{marginTop:24}}>
            <div style={{color:'#ff0',marginBottom:4}}>통계</div>
            {stats.length === 0 ? <div>통계 없음</div> : (
              <ul style={{listStyle:'none',padding:0}}>
                {stats.map(s => (
                  <li key={s._id}>{test.results[s._id] || s._id}: {s.count}명</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
} 