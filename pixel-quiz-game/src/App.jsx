import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { fetchQuestions, submitAnswers } from './api';

function App() {
  const [gameState, setGameState] = useState('start'); // start, loading, playing, submitting, result
  const [playerId, setPlayerId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleStart = async (id) => {
    setPlayerId(id);
    setGameState('loading');
    
    const fetchedQuestions = await fetchQuestions();
    setQuestions(fetchedQuestions);
    setUserAnswers([]);
    setGameState('playing');
  };

  const handleFinish = async (answers) => {
    setGameState('submitting');
    setUserAnswers(answers);
    
    const finalResult = await submitAnswers(playerId, answers);
    setResult(finalResult);
    setGameState('result');
  };

  const handleRestart = () => {
    setGameState('start');
    setPlayerId('');
    setQuestions([]);
    setUserAnswers([]);
    setResult(null);
  };

  return (
    <div className="app-container">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'loading' && <div className="loading blink">LOADING STAGE...</div>}
      {gameState === 'playing' && (
        <GameScreen 
          playerId={playerId} 
          questions={questions} 
          onFinish={handleFinish} 
        />
      )}
      {gameState === 'submitting' && <div className="loading blink">CALCULATING SCORE...</div>}
      {gameState === 'result' && (
        <ResultScreen 
          result={result} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}

export default App;
