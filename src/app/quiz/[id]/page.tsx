'use client';
import React, { useState, useEffect } from 'react';
import styles from './quiz.module.css';

interface Test {
  id: number;
  title: string;
  description: string;
  image?: string;
  questions: {
    question: string;
    options: { text: string; result: string }[];
  }[];
  results: Record<string, { short: string; detail: string }>;
}

export default function QuizDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/test/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setTest(data);
        setLoading(false);
        setStep(0);
        setAnswers([]);
        setShowResult(false);
      });
  }, [id]);

  if (loading || !test) return <main className={styles.main}><div>로딩 중...</div></main>;

  const handleOption = (result: string) => {
    const nextAnswers = [...answers, result];
    if (step + 1 < test.questions.length) {
      setStep(step + 1);
      setAnswers(nextAnswers);
    } else {
      setAnswers(nextAnswers);
      setShowResult(true);
    }
  };

  const getResultKey = () => {
    const freq: Record<string, number> = {};
    answers.forEach((r) => (freq[r] = (freq[r] || 0) + 1));
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] as keyof typeof test.results;
  };

  // 공유 모달 관련
  const handleShare = async () => {
    // 결과 POST로 저장, rid 반환
    const res = await fetch('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId: Number(id), answers, result: getResultKey() }),
    });
  
    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error('JSON 파싱 실패:', e);
      data = null;
    }
    if (!res.ok) {
      // 서버에서 에러 반환
      console.error('API 에러:', data);
      return;
    }

    if (data.rid) {
      const url = `${window.location.origin}/quiz/${id}/result?rid=${data.rid}`;
      setShareUrl(url);
      setShowModal(true);
    } else {
      alert('공유 링크 생성에 실패했습니다.');
    }
  };
  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다!');
    }
  };
  const handleKakaoShare = () => {
    if (shareUrl) {
      window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}`);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>{test.title}</div>
      <div className={styles.quizBox}>
        <div style={{marginBottom:'1.2rem', color:'#555', fontWeight:500}}>{test.description}</div>
        {!showResult ? (
          <>
            <div className={styles.question}>Q{step + 1}. {test.questions[step].question}</div>
            <div className={styles.options}>
              {test.questions[step].options.map((opt, idx) => (
                <button
                  key={idx}
                  className={styles.optionBtn}
                  onClick={() => handleOption(opt.result)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <div className={styles.progress}>{step + 1} / {test.questions.length}</div>
          </>
        ) : (
          <div className={styles.resultBox}>
            <div className={styles.resultTitle}>{test.results[getResultKey()]?.short}</div>
            <div className={styles.resultText}>{test.results[getResultKey()]?.detail}</div>
            <button className={styles.retryBtn} onClick={() => { setStep(0); setAnswers([]); setShowResult(false); }}>다시하기</button>
            <button className={styles.addBtn} onClick={handleShare}>공유하기</button>
          </div>
        )}
      </div>
      {showModal && shareUrl && (
        <div style={{
          position:'fixed', left:0, top:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.32)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center',
        }} onClick={() => setShowModal(false)}>
          <div
            style={{
              width:'60vw', maxWidth:480, minWidth:260, background:'#fff', borderRadius:16, boxShadow:'0 2px 24px #0002', padding:'36px 24px', position:'relative',
              display:'flex', flexDirection:'column', alignItems:'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:18, color:'#222'}}>공유하기</h3>
            <div style={{wordBreak:'break-all', fontSize:'0.98rem', color:'#555', marginBottom:16}}>{shareUrl}</div>
            <button onClick={handleCopyUrl} style={{margin:'0 0 16px 0', padding:'10px 24px', borderRadius:8, background:'#7f9cf5', color:'#fff', border:'none', fontWeight:600, fontSize:'1rem', cursor:'pointer'}}>URL 복사</button>
            <button onClick={handleKakaoShare} style={{margin:'0 0 16px 0', padding:'10px 24px', borderRadius:8, background:'#ffe812', color:'#222', border:'none', fontWeight:600, fontSize:'1rem', cursor:'pointer'}}>카카오톡 공유</button>
            <button onClick={() => setShowModal(false)} style={{margin:'0 0 0 0', padding:'8px 18px', borderRadius:8, background:'#ececf0', color:'#222', border:'none', fontWeight:600, fontSize:'1rem', cursor:'pointer'}}>닫기</button>
          </div>
        </div>
      )}
    </main>
  );
} 