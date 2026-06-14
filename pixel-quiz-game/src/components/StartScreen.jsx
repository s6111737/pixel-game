import React, { useState } from 'react';

const StartScreen = ({ onStart }) => {
  const [idInput, setIdInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idInput.trim()) {
      onStart(idInput.trim());
    }
  };

  return (
    <div className="pixel-box" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1 className="blink" style={{ color: 'var(--text-secondary)' }}>PIXEL QUIZ</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '0.8rem', lineHeight: '1.5' }}>
        INSERT COIN...<br/>JUST KIDDING.<br/>ENTER YOUR ID!
      </p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="PLAYER ID" 
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          maxLength={15}
          required
        />
        <button type="submit">START GAME</button>
      </form>
    </div>
  );
};

export default StartScreen;
