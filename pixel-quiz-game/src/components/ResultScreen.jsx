import React from 'react';

const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10);

const ResultScreen = ({ result, onRestart }) => {
  const isPass = result && result.correct >= PASS_THRESHOLD;

  return (
    <div className="pixel-box" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className={isPass ? "blink" : ""} style={{ color: isPass ? 'var(--text-primary)' : 'var(--error-color)' }}>
        {isPass ? "STAGE CLEAR!" : "GAME OVER"}
      </h1>

      <div style={{ margin: '30px 0', lineHeight: '2' }}>
        <p>SCORE: {result?.score || 0}</p>
        <p>CORRECT: {result?.correct || 0} / {result?.total || 0}</p>
        {result?.firstClearScore && <p>FIRST CLEAR SCORE: {result.firstClearScore}</p>}
        {result?.clearAttempts && <p>CLEAR ATTEMPTS: {result.clearAttempts}</p>}
        {result?.highScore && <p>HIGH SCORE: {result.highScore}</p>}
        {result?.attempts && <p>ATTEMPTS: {result.attempts}</p>}
      </div>

      <button onClick={onRestart}>PLAY AGAIN</button>
    </div>
  );
};

export default ResultScreen;
