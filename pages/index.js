
'use client';

import { useState } from 'react';

export default function Home() {
  const [nama1, setNama1] = useState('');
  const [nama2, setNama2] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);

  // Tic Tac Toe state
  const [tttBoard, setTttBoard] = useState(Array(9).fill(null));
  const [tttIsXNext, setTttIsXNext] = useState(true);
  const [tttWinner, setTttWinner] = useState(null);

  // Rock Paper Scissors
  const [rpsChoice, setRpsChoice] = useState(null);
  const [rpsAiChoice, setRpsAiChoice] = useState(null);
  const [rpsResult, setRpsResult] = useState('');

  // Hangman
  const words = ['JODOH', 'CINTA', 'PACAR', 'SELAMANYA', 'BAHAGIA'];
  const [hangmanWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const [hangmanGuessed, setHangmanGuessed] = useState([]);
  const [hangmanAttempts, setHangmanAttempts] = useState(6);
  const [hangmanMessage, setHangmanMessage] = useState('');

  // Memory Match
  const emojis = ['❤️', '💑', '😘', '💕', '❤️', '💑', '😘', '💕'];
  const [memoryCards, setMemoryCards] = useState(emojis.sort(() => Math.random() - 0.5).map((v, i) => ({ id: i, value: v, flipped: false, matched: false })));
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [memoryMatches, setMemoryMatches] = useState(0);

  // Love Quiz
  const quizQuestions = [
    { q: 'Makanan favorit pasanganmu?', a: 'Pizza' }, // contoh, bisa diganti
    { q: 'Warna favoritnya?', a: 'Merah' },
    { q: 'Film romantis favorit?', a: 'Titanic' },
    { q: 'Hobi bareng yang paling suka?', a: 'Jalan-jalan' },
    { q: 'Tanggal jadian kalian?', a: '14 Februari' }
  ];
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setCurrentGame(null);

    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama1, nama2 }),
    });

    const data = await res.json();
    setResult(`${data.result}%`);
    setLoading(false);
  };

  // Tic Tac Toe logic
  const calculateTttWinner = (squares) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleTttClick = (i) => {
    if (tttBoard[i] || tttWinner) return;
    const newBoard = [...tttBoard];
    newBoard[i] = tttIsXNext ? 'X' : 'O';
    setTttBoard(newBoard);
    setTttIsXNext(!tttIsXNext);
    setTttWinner(calculateTttWinner(newBoard));
  };

  const resetTtt = () => {
    setTttBoard(Array(9).fill(null));
    setTttIsXNext(true);
    setTttWinner(null);
  };

  // Rock Paper Scissors
  const playRps = (choice) => {
    const choices = ['rock', 'paper', 'scissors'];
    const ai = choices[Math.floor(Math.random() * 3)];
    setRpsChoice(choice);
    setRpsAiChoice(ai);
    if (choice === ai) setRpsResult('Seri! 🤝');
    else if ((choice === 'rock' && ai === 'scissors') || (choice === 'paper' && ai === 'rock') || (choice === 'scissors' && ai === 'paper')) setRpsResult('Kamu Menang! 🎉');
    else setRpsResult('AI Menang! 😢');
  };

  // Hangman
  const handleHangmanGuess = (e) => {
    const letter = e.target.value.toUpperCase();
    if (letter.length === 1 && !hangmanGuessed.includes(letter)) {
      setHangmanGuessed([...hangmanGuessed, letter]);
      if (!hangmanWord.includes(letter)) setHangmanAttempts(hangmanAttempts - 1);
      e.target.value = '';
      if (hangmanWord.split('').every(l => hangmanGuessed.concat(letter).includes(l))) setHangmanMessage('Kamu Menang! ❤️');
      if (hangmanAttempts - 1 === 0) setHangmanMessage('Kalah! Kata: ' + hangmanWord);
    }
  };

  // Memory Match
  const handleMemoryFlip = (id) => {
    if (memoryFlipped.length === 2) return;
    const newCards = memoryCards.map(card => card.id === id ? { ...card, flipped: true } : card);
    setMemoryCards(newCards);
    setMemoryFlipped([...memoryFlipped, id]);

    if (memoryFlipped.length === 1) {
      const first = memoryCards[memoryFlipped[0]];
      const second = newCards.find(c => c.id === id);
      if (first.value === second.value) {
        setMemoryCards(newCards.map(c => c.id === id || c.id === memoryFlipped[0] ? { ...c, matched: true } : c));
        setMemoryMatches(memoryMatches + 1);
      }
      setTimeout(() => {
        setMemoryCards(newCards.map(c => c.matched ? c : { ...c, flipped: false }));
        setMemoryFlipped([]);
      }, 1000);
    }
  };

  const resetMemory = () => {
    setMemoryCards(emojis.sort(() => Math.random() - 0.5).map((v, i) => ({ id: i, value: v, flipped: false, matched: false })));
    setMemoryFlipped([]);
    setMemoryMatches(0);
  };

  // Love Quiz
  const handleQuizAnswer = () => {
    if (quizAnswer.toLowerCase() === quizQuestions[quizIndex].a.toLowerCase()) setQuizScore(quizScore + 1);
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(quizIndex + 1);
      setQuizAnswer('');
    } else {
      setQuizDone(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizAnswer('');
    setQuizScore(0);
    setQuizDone(false);
  };

  const backToHome = () => {
    setCurrentGame(null);
    resetTtt();
    setRpsResult('');
    setHangmanMessage('');
    resetMemory();
    resetQuiz();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1f2937, #4b5563)',
      color: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {!currentGame ? (
        <>
          <h1 style={{ fontSize: 'clamp(40px, 10vw, 60px)', color: '#f43f5e', fontWeight: 'bold', marginBottom: '40px' }}>
            💙 Cek Jodoh 💙
          </h1>

          <div style={{
            background: 'rgba(75, 85, 99, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            <form onSubmit={handleSubmit}>
              <input placeholder="Nama kamu" value={nama1} onChange={(e) => setNama1(e.target.value)} required style={{
                width: '100%', padding: '16px', margin: '12px 0', background: '#374151', border: '1px solid #9ca3af', borderRadius: '12px', color: '#f3f4f6', fontSize: '18px'
              }} />
              <input placeholder="Nama pasanganmu" value={nama2} onChange={(e) => setNama2(e.target.value)} required style={{
                width: '100%', padding: '16px', margin: '12px 0', background: '#374151', border: '1px solid #9ca3af', borderRadius: '12px', color: '#f3f4f6', fontSize: '18px'
              }} />
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '16px', marginTop: '20px', background: '#f43f5e', color: '#1f2937', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer'
              }}>
                {loading ? 'Menghitung...' : 'Cek Sekarang'}
              </button>
            </form>
          </div>

          {result && (
            <>
              <div style={{
                marginTop: '60px',
                padding: '40px',
                background: 'rgba(244, 63, 94, 0.2)',
                borderRadius: '30px',
                fontSize: 'clamp(50px, 15vw, 80px)',
                fontWeight: 'bold',
                color: '#f43f5e',
                boxShadow: '0 0 40px rgba(244, 63, 94, 0.5)'
              }}>
                {result}%
              </div>

              <div style={{ marginTop: '60px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', color: '#9ca3af', marginBottom: '30px' }}>Main Game Bareng Yuk! 🎮</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', maxWidth: '800px' }}>
                  <button onClick={() => setCurrentGame('ttt')} style={{ padding: '20px', fontSize: '20px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Tic-Tac-Toe</button>
                  <button onClick={() => setCurrentGame('rps')} style={{ padding: '20px', fontSize: '20px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Rock Paper Scissors</button>
                  <button onClick={() => setCurrentGame('hangman')} style={{ padding: '20px', fontSize: '20px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Hangman</button>
                  <button onClick={() => setCurrentGame('memory')} style={{ padding: '20px', fontSize: '20px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Memory Match</button>
                  <button onClick={() => setCurrentGame('quiz')} style={{ padding: '20px', fontSize: '20px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Love Quiz</button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{
          background: 'rgba(75, 85, 99, 0.8)',
          backdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 50px rgba(244, 63, 94, 0.3)'
        }}>
          <button onClick={backToHome} style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '30px', background: 'none', border: 'none', cursor: 'pointer' }}>❤️</button>

          {currentGame === 'ttt' && (
            <>
              <h2 style={{ fontSize: '36px', color: '#f43f5e' }}>Tic-Tac-Toe</h2>
              <p style={{ fontSize: '20px' }}>Giliran: <strong>{tttIsXNext ? 'X' : 'O'}</strong></p>
              {tttWinner && <p style={{ fontSize: '30px', color: '#f43f5e' }}>Pemenang: {tttWinner} 🎉</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '30px 0' }}>
                {tttBoard.map((cell, i) => (
                  <button key={i} onClick={() => handleTttClick(i)} style={{ height: '80px', fontSize: '40px', background: '#374151', color: '#f3f4f6', borderRadius: '12px', border: '2px solid #9ca3af' }}>
                    {cell}
                  </button>
                ))}
              </div>
              <button onClick={resetTtt} style={{ padding: '10px 20px', background: '#f43f5e', color: '#1f2937', borderRadius: '10px' }}>Reset</button>
            </>
          )}

          {currentGame === 'rps' && (
            <>
              <h2 style={{ fontSize: '36px', color: '#f43f5e' }}>Rock Paper Scissors</h2>
              <div style={{ margin: '30px 0' }}>
                <button onClick={() => playRps('rock')} style={{ margin: '10px', padding: '20px', fontSize: '24px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px' }}>✊ Rock</button>
                <button onClick={() => playRps('paper')} style={{ margin: '10px', padding: '20px', fontSize: '24px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px' }}>✋ Paper</button>
                <button onClick={() => playRps('scissors')} style={{ margin: '10px', padding: '20px', fontSize: '24px', background: '#4b5563', color: '#f3f4f6', borderRadius: '12px' }}>✌️ Scissors</button>
              </div>
              {rpsResult && <p style={{ fontSize: '30px', color: '#f43f5e' }}>{rpsResult}</p>}
            </>
          )}

          {currentGame === 'hangman' && (
            <>
              <h2 style={{ fontSize: '36px', color: '#f43f5e' }}>Hangman</h2>
              <p style={{ fontSize: '30px', letterSpacing: '10px' }}>
                {hangmanWord.split('').map(l => hangmanGuessed.includes(l) ? l : '_').join(' ')}
              </p>
              <p>Sisa nyawa: {hangmanAttempts}</p>
              <input type="text" maxLength="1" onChange={handleHangmanGuess} style={{ padding: '10px', fontSize: '24px', width: '50px', textAlign: 'center' }} placeholder="?" />
              {hangmanMessage && <p style={{ fontSize: '30px', color: '#f43f5e' }}>{hangmanMessage}</p>}
            </>
          )}

          {currentGame === 'memory' && (
            <>
              <h2 style={{ fontSize: '36px', color: '#f43f5e' }}>Memory Match</h2>
              <p>Pasangan ditemukan: {memoryMatches}/4</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '30px 0' }}>
                {memoryCards.map(card => (
                  <button key={card.id} onClick={() => handleMemoryFlip(card.id)} style={{
                    height: '70px', fontSize: '40px', background: card.flipped || card.matched ? '#4b5563' : '#374151', color: '#f3f4f6', borderRadius: '12px'
                  }}>
                    {card.flipped || card.matched ? card.value : '?'}
                  </button>
                ))}
              </div>
              <button onClick={resetMemory} style={{ padding: '10px 20px', background: '#f43f5e', color: '#1f2937', borderRadius: '10px' }}>Reset</button>
            </>
          )}

          {currentGame === 'quiz' && (
            <>
              <h2 style={{ fontSize: '36px', color: '#f43f5e' }}>Love Quiz</h2>
              {!quizDone ? (
                <>
                  <p style={{ fontSize: '24px' }}>{quizQuestions[quizIndex].q}</p>
                  <input value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)} style={{ padding: '15px', fontSize: '20px', width: '80%', margin: '20px 0' }} placeholder="Jawabanmu" />
                  <button onClick={handleQuizAnswer} style={{ padding: '15px', background: '#f43f5e', color: '#1f2937', borderRadius: '12px' }}>Submit</button>
                </>
              ) : (
                <p style={{ fontSize: '32px', color: '#f43f5e' }}>Skor: {quizScore}/{quizQuestions.length} ❤️</p>
              )}
              <button onClick={resetQuiz} style={{ marginTop: '20px', padding: '10px 20px', background: '#f43f5e', color: '#1f2937', borderRadius: '10px' }}>Reset Quiz</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
