import React, { useState, useEffect } from 'react';

const GameScreen = ({ playerId, questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  // Preload Boss Images
  useEffect(() => {
    questions.forEach((q, index) => {
      const img = new Image();
      // Using DiceBear Pixel Art
      img.src = `https://api.dicebear.com/9.x/pixel-art/svg?seed=boss_${q.id || index}`;
    });
  }, [questions]);

  const handleAnswer = (selectedOption) => {
    const currentQ = questions[currentIndex];
    const newAnswers = [...answers, { id: currentQ.id, answer: selectedOption }];
    setAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(newAnswers);
    }
  };

  if (!questions || questions.length === 0) {
    return <div className="loading">ERROR: NO QUESTIONS</div>;
  }

  const q = questions[currentIndex];
  const bossSeed = `boss_${q.id || currentIndex}`;
  const bossImageUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${bossSeed}`;

  return (
    <div className="pixel-box">
      <div className="status-bar">
        <span>PLAYER: {playerId}</span>
        <span>STAGE: {currentIndex + 1} / {questions.length}</span>
      </div>

      <img src={bossImageUrl} alt="Boss" className="boss-image" />
      
      <h2 style={{ fontSize: '1rem', minHeight: '60px' }}>{q.question}</h2>

      <div className="options-grid">
        <button onClick={() => handleAnswer('A')}>A. {q.A}</button>
        <button onClick={() => handleAnswer('B')}>B. {q.B}</button>
        <button onClick={() => handleAnswer('C')}>C. {q.C}</button>
        <button onClick={() => handleAnswer('D')}>D. {q.D}</button>
      </div>
    </div>
  );
};

export default GameScreen;
