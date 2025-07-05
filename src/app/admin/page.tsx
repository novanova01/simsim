'use client';
import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

interface Test {
  _id: string;
  title: string;
}

export default function AdminPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
        setTests(data);
        setLoading(false);
      });
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: '', questions: [], results: {} }),
    });
    if (res.ok) {
      const added = await res.json();
      setTests([added, ...tests]);
      setNewTitle('');
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/test/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTests(tests.filter(t => t._id !== id));
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>어드민 - 테스트 관리</h1>
      <div className={styles.section}>
        <h2 className={styles.subtitle}>테스트 리스트</h2>
        {loading ? <div>로딩 중...</div> : (
          <ul className={styles.testList}>
            {tests.map((t) => (
              <li key={t._id} className={styles.testItem}>
                {t.title}
                <button className={styles.cancelBtn} style={{marginLeft:8}} onClick={() => handleDelete(t._id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
        {showForm ? (
          <div className={styles.formBox}>
            <input
              className={styles.input}
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="테스트 제목 입력"
            />
            <button className={styles.addBtn} onClick={handleAdd}>추가</button>
            <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>취소</button>
          </div>
        ) : (
          <button className={styles.addBtn} onClick={() => setShowForm(true)}>테스트 추가</button>
        )}
      </div>
      <div className={styles.section}>
        <h2 className={styles.subtitle}>구글 애널리틱스 통계</h2>
        <div className={styles.analyticsBox}>
          {/* 실제 배포 시 구글 애널리틱스 대시보드 iframe 또는 차트 삽입 */}
          <div className={styles.analyticsDummy}>[구글 애널리틱스 대시보드 자리]</div>
        </div>
      </div>
    </main>
  );
} 