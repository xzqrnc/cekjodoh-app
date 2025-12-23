'use client';

import { useState } from 'react';

export default function Home() {
  const [nama1, setNama1] = useState('');
  const [nama2, setNama2] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGamesMenu, setShowGamesMenu] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);

  // Tic-Tac-Toe
  const [tttBoard, setTttBoard] = useState(Array(9).fill(null));
  const [tttIsXNext, setTttIsXNext] = useState(true);
  const [tttWinner, setTttWinner] = useState(null);

  // Rock Paper Scissors
  const [rpsResult, setRpsResult] = useState('');

  // Hangman
  const words = ['JODOH', 'CINTA', 'PACAR', 'BAHAGIA', 'SELAMANYA', 'ROMANTIS'];
  const [hangmanWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const [hangmanGuessed, setHangmanGuessed] = useState([]);
  const [hangmanAttempts, setHangmanAttempts] = useState(6);

  // Memory Match
  const emojis = ['❤️', '💑', '😘', '💕', '🌹', '💏', '🥰', '💖'];
  const [memoryCards, setMemoryCards] = useState([]);
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [memoryMatches, setMemoryMatches] = useState(0);

  // Love Quiz
  const quizQuestions = [
    { q: "Makanan favorit pasanganmu?", hint: "Coba ingat-ingat 😏" },
    { q: "Lagu yang sering kalian nyanyi bareng?", hint: "Yang bikin melting itu loh" },
    { q: "Tempat favorit kalian date?", hint: "Romantis banget kan?" },
    { q: "Warna favoritnya?", hint: "Yang sering dipake" },
    { q: "Tanggal spesial kalian?", hint: "Jangan lupa ya!" }
  ];
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setShowGamesMenu(false);
    setCurrentGame(null);

    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama1, nama2 }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  const backToHome = () => {
    setCurrentGame(null);
    setShowGamesMenu(false);
    resetAllGames();
  };

  const resetAllGames = () => {
    setTttBoard(Array(9).fill(null));
    setTttIsXNext(true);
    setTttWinner(null);
    setRpsResult('');
    setHangmanGuessed([]);
    setHangmanAttempts(6);
    setMemoryCards(emojis.sort(() => Math.random() - 0.5).map((v, i) => ({ id: i, value: v, flipped: false, matched: false })));
    setMemoryFlipped([]);
    setMemoryMatches(0);
    setQuizIndex(0);
    setQuizAnswer('');
    setQuizScore(0);
    setQuizDone(false);
  };

  // Tic-Tac-Toe
  const calculateWinner = (squares) => {
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
    const winner = calculateWinner(newBoard);
    if (winner) setTttWinner(winner);
  };

  // Rock Paper Scissors
  const playRps = (choice) => {
    const choices = ['rock', 'paper', 'scissors'];
    const ai = choices[Math.floor(Math.random() * 3)];
    let text = '';
    if (choice === ai) text = 'Seri! 🤝';
    else if (
      (choice === 'rock' && ai === 'scissors') ||
      (choice === 'paper' && ai === 'rock') ||
      (choice === 'scissors' && ai === 'paper')
    ) text = 'Kamu Menang! 🎉';
    else text = 'Kalah! 😢 AI pilih ' + ai;
    setRpsResult(text);
  };

  // Hangman
  const handleHangmanGuess = (e) => {
    const letter = e.target.value.toUpperCase()[0];
    if (letter && !hangmanGuessed.includes(letter)) {
      setHangmanGuessed([...hangmanGuessed, letter]);
      if (!hangmanWord.includes(letter)) setHangmanAttempts(hangmanAttempts - 1);
      e.target.value = '';
    }
  };

  const hangmanDisplay = hangmanWord.split('').map(l => hangmanGuessed.includes(l) ? l : '_').join(' ');

  const hangmanWon = hangmanWord.split('').every(l => hangmanGuessed.includes(l));
  const hangmanLost = hangmanAttempts === 0;

  // Memory Match
  const handleMemoryFlip = (id) => {
    if (memoryFlipped.length === 2 || memoryCards[id]?.matched) return;
    const newCards = memoryCards.map(card => card.id === id ? { ...card, flipped: true } : card);
    setMemoryCards(newCards);
    setMemoryFlipped([...memoryFlipped, id]);

    if (memoryFlipped.length === 1) {
      const first = memoryCards[memoryFlipped[0]];
      const second = memoryCards[id];
      if (first.value === second.value) {
        setTimeout(() => {
          setMemoryCards(cards => cards.map(c => c.id === id || c.id === memoryFlipped[0] ? { ...c, matched: true } : c));
          setMemoryMatches(memoryMatches + 1);
        }, 600);
      }
      setTimeout(() => {
        setMemoryCards(cards => cards.map(c => c.matched ? c : { ...c, flipped: false }));
        setMemoryFlipped([]);
      }, 1200);
    }
  };

  // Love Quiz
  const handleQuizSubmit = () => {
    if (quizAnswer.trim()) {
      setQuizScore(quizScore + 1); // semua benar biar fun ☺
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex(quizIndex + 1);
        setQuizAnswer('');
      } else {
        setQuizDone(true);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #111827, #1f2937)',
      color: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* HOME / CEK JODOH */}
      {!currentGame && !showGamesMenu && (
        <>
          <h1 style={{ fontSize: 'clamp(48px, 12vw, 72px)', fontWeight: 'bold', color: '#f43f5e', marginBottom: '50px' }}>
            💙 Cek Jodoh 💙
          </h1>

          <div style={{
            background: 'rgba(31, 41, 55, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Nama kamu"
                value={nama1}
                onChange={(e) => setNama1(e.target.value)}
                required
                style={{ width: '100%', padding: '18px', margin: '12px 0', background: '#374151', border: 'none', borderRadius: '16px', color: '#f3f4f6', fontSize: '18px' }}
              />
              <input
                placeholder="Nama pasanganmu"
                value={nama2}
                onChange={(e) => setNama2(e.target.value)}
                required
                style={{ width: '100%', padding: '18px', margin: '12px 0', background: '#374151', border: 'none', borderRadius: '16px', color: '#f3f4f6', fontSize: '18px' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  marginTop: '20px',
                  background: '#f43f5e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Menghitung...' : 'Cek Sekarang'}
              </button>
            </form>
          </div>

          {result && (
            <>
              <div style={{
                marginTop: '80px',
                padding: '40px 60px',
                background: 'rgba(244, 63, 94, 0.3)',
                borderRadius: '40px',
                fontSize: 'clamp(60px, 18vw, 100px)',
                fontWeight: 'bold',
                color: '#f43f5e',
                boxShadow: '0 0 60px rgba(244, 63, 94, 0.6)',
                textAlign: 'center'
              }}>
                {result}%
              </div>

              <button
                onClick={() => setShowGamesMenu(true)}
                style={{
                  marginTop: '80px',
                  fontSize: '100px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🎮
              </button>
            </>
          )}
        </>
      )}

      {/* MENU PILIH GAME */}
      {showGamesMenu && !currentGame && (
        <div style={{
          background: 'rgba(31, 41, 55, 0.9)',
          backdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '50px 30px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(244, 63, 94, 0.3)'
        }}>
          <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '40px' }}>Pilih Game Seru! 🎯</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <button onClick={() => { setCurrentGame('ttt'); setShowGamesMenu(false); }} style={{ padding: '30px', fontSize: '20px', background: '#374151', color: '#f3f4f6', borderRadius: '16px', border: 'none' }}>Tic-Tac-Toe</button>
            <button onClick={() => { setCurrentGame('rps'); setShowGamesMenu(false); }} style={{ padding: '30px', fontSize: '20px', background: '#374151', color: '#f3f4f6', borderRadius: '16px', border: 'none' }}>Rock Paper Scissors</button>
            <button onClick={() => { setCurrentGame('hangman'); setShowGamesMenu(false); }} style={{ padding: '30px', fontSize: '20px', background: '#374151', color: '#f3f4f6', borderRadius: '16px', border: 'none' }}>Hangman</button>
            <button onClick={() => { setCurrentGame('memory'); setShowGamesMenu(false); resetAllGames(); }} style={{ padding: '30px', fontSize: '20px', background: '#374151', color: '#f3f4f6', borderRadius: '16px', border: 'none' }}>Memory Match</button>
            <button onClick={() => { setCurrentGame('quiz'); setShowGamesMenu(false); }} style={{ padding: '30px', fontSize: '20px', background: '#374151', color: '#f3f4f6', borderRadius: '16px', border: 'none' }}>Love Quiz</button>
          </div>
          <button onClick={backToHome} style={{ marginTop: '50px', fontSize: '60px', background: 'none', border: 'none' }}>❤️</button>
        </div>
      )}

      {/* GAMES */}
      {currentGame && (
        <div style={{
          position: 'relative',
          background: 'rgba(31, 41, 55, 0.9)',
          backdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '50px 30px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(244, 63, 94, 0.3)'
        }}>
          <button onClick={backToHome} style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '40px', background: 'none', border: 'none' }}>❤️</button>

          {/* Tic-Tac-Toe */}
          {currentGame === 'ttt' && (
            <>
              <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Tic-Tac-Toe</h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '30px' }}>
                Main bergantian isi kotak. Dapat 3 simbol sejajar = menang! Kalah = traktir es krim 😘
              </p>
              <p style={{ fontSize: '20px' }}>Giliran: <strong style={{ color: '#f43f5e' }}>{tttIsXNext ? 'X' : 'O'}</strong></p>
              {tttWinner && <p style={{ fontSize: '32px', color: '#f43f5e' }}>Pemenang: {tttWinner} 🎉</p>}
              {!tttWinner && tttBoard.every(c => c) && <p style={{ fontSize: '32px', color: '#9ca3af' }}>Seri! 🤝</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', margin: '40px 0' }}>
                {tttBoard.map((cell, i) => (
                  <button key={i} onClick={() => handleTttClick(i)} disabled={cell || tttWinner} style={{
                    height: '90px', fontSize: '50px', background: '#1f2937', color: '#f3f4f6', borderRadius: '16px', border: '3px solid #6b7280', cursor: 'pointer'
                  }}>
                    {cell}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Rock Paper Scissors */}
          {currentGame === 'rps' && (
            <>
              <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Rock Paper Scissors</h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '30px' }}>
                Pilih satu, lawan AI random. Menang = pasangan kasih ciuman! 💋
              </p>
              <div style={{ margin: '40px 0' }}>
                <button onClick={() => playRps('rock')} style={{ margin: '10px', padding: '20px 30px', fontSize: '30px', background: '#374151', color: '#f3f4f6', borderRadius: '16px' }}>✊</button>
                <button onClick={() => playRps('paper')} style={{ margin: '10px', padding: '20px 30px', fontSize: '30px', background: '#374151', color: '#f3f4f6', borderRadius: '16px' }}>✋</button>
                <button onClick={() => playRps('scissors')} style={{ margin: '10px', padding: '20px 30px', fontSize: '30px', background: '#374151', color: '#f3f4f6', borderRadius: '16px' }}>✌️</button>
              </div>
              {rpsResult && <p style={{ fontSize: '32px', color: '#f43f5e' }}>{rpsResult}</p>}
            </>
          )}

          {/* Hangman */}
          {currentGame === 'hangman' && (
            <>
              <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Hangman</h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '30px' }}>
                Tebak kata romantis! Ketik 1 huruf. 6 kali salah = kalah. Pasangan boleh kasih hint 😏
              </p>
              <p style={{ fontSize: '36px', letterSpacing: '8px', margin: '40px 0' }}>{hangmanDisplay}</p>
              <p style={{ fontSize: '20px' }}>Nyawa tersisa: <strong style={{ color: hangmanAttempts < 3 ? '#f43f5e' : '#9ca3af' }}>{hangmanAttempts}</strong></p>
              <input
                type="text"
                maxLength="1"
                onChange={handleHangmanGuess}
                style={{ padding: '15px', fontSize: '30px', width: '60px', textAlign: 'center', borderRadius: '12px', background: '#374151', color: '#f3f4f6', border: 'none', marginTop: '20px' }}
                placeholder="?"
              />
              {hangmanWon && <p style={{ fontSize: '32px', color: '#f43f5e', marginTop: '30px' }}>Yeay! Kamu Menang ❤️</p>}
              {hangmanLost && <p style={{ fontSize: '32px', color: '#f43f5e', marginTop: '30px' }}>Kalah! Kata: {hangmanWord}</p>}
            </>
          )}

          {/* Memory Match */}
          {currentGame === 'memory' && (
            <>
              <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Memory Match</h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '30px' }}>
                Cocokkan 8 emoji couple. Yang nemu pasangan duluan dapat pelukan! 🥰
              </p>
              <p style={{ fontSize: '20px' }}>Pasangan ditemukan: {memoryMatches}/4</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', margin: '40px 0' }}>
                {memoryCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleMemoryFlip(card.id)}
                    style={{
                      height: '70px',
                      fontSize: '40px',
                      background: card.flipped || card.matched ? '#374151' : '#1f2937',
                      color: '#f3f4f6',
                      borderRadius: '16px',
                      border: '2px solid #6b7280',
                      cursor: 'pointer'
                    }}
                  >
                    {card.flipped || card.matched ? card.value : '?'}
                  </button>
                ))}
              </div>
              {memoryMatches === 4 && <p style={{ fontSize: '32px', color: '#f43f5e', marginTop: '30px' }}>Selamat! Kalian Soulmate ❤️</p>}
            </>
          )}

          {/* Love Quiz */}
          {currentGame === 'quiz' && (
            <>
              <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Love Quiz</h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '30px' }}>
                Jawab pertanyaan tentang pasanganmu. Semua jawaban benar biar mesra terus ☺
              </p>
              {!quizDone ? (
                <>
                  <p style={{ fontSize: '24px', margin: '30px 0' }}>{quizQuestions[quizIndex].q}</p>
                  <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '20px' }}>{quizQuestions[quizIndex].hint}</p>
                  <input
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    placeholder="Jawabanmu..."
                    style={{ width: '80%', padding: '15px', fontSize: '18px', borderRadius: '12px', background: '#374151', color: '#f3f4f6', border: 'none' }}
                  />
                  <button
                    onClick={handleQuizSubmit}
                    style={{ marginTop: '20px', padding: '15px 30px', background: '#f43f5e', color: '#fff', borderRadius: '12px', fontSize: '18px' }}
                  >
                    Submit
                  </button>
                </>
              ) : (
                <p style={{ fontSize: '36px', color: '#f43f5e', marginTop: '40px' }}>
                  Skor: {quizScore}/{quizQuestions.length} ❤️ Kamu paham banget sama dia!
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
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
