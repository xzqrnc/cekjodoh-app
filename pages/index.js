'use client';

import { useState, useEffect } from 'react';

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

  // Memory Match
  const baseEmojis = ['❤️', '💑', '😘', '💕', '🌹', '😍', '✨', '🥰'];
  const fullEmojis = [...baseEmojis, ...baseEmojis];
  const [memoryCards, setMemoryCards] = useState([]);
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [memoryMatches, setMemoryMatches] = useState(0);
  const [memoryTimeLeft, setMemoryTimeLeft] = useState(180);
  const [memoryTimerActive, setMemoryTimerActive] = useState(false);
  const [memoryGameOver, setMemoryGameOver] = useState(false);

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
    resetGames();
  };

  const resetMemoryGame = () => {
    const shuffled = [...fullEmojis].sort(() => Math.random() - 0.5).map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    }));
    setMemoryCards(shuffled);
    setMemoryFlipped([]);
    setMemoryMatches(0);
    setMemoryTimeLeft(180);
    setMemoryTimerActive(true);
    setMemoryGameOver(false);
  };

  const startMemoryGame = () => {
    resetMemoryGame();
  };

  useEffect(() => {
    if (memoryTimerActive && memoryTimeLeft > 0 && memoryMatches < 8) {
      const timer = setTimeout(() => setMemoryTimeLeft(memoryTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (memoryTimeLeft === 0 && memoryTimerActive) {
      setMemoryGameOver(true);
      setMemoryTimerActive(false);
    }
  }, [memoryTimeLeft, memoryTimerActive, memoryMatches]);

  useEffect(() => {
    if (memoryMatches === 8) {
      setMemoryTimerActive(false);
    }
  }, [memoryMatches]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `\( {m}: \){s < 10 ? '0' + s : s}`;
  };

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

  const handleMemoryFlip = (id) => {
    if (memoryFlipped.length === 2 || memoryGameOver || memoryMatches === 8) return;
    const card = memoryCards.find(c => c.id === id);
    if (card.matched || card.flipped) return;

    const newCards = memoryCards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setMemoryCards(newCards);

    const newFlipped = [...memoryFlipped, id];
    setMemoryFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const first = memoryCards.find(c => c.id === newFlipped[0]);
      const second = memoryCards.find(c => c.id === newFlipped[1]);

      if (first.value === second.value) {
        setTimeout(() => {
          setMemoryCards(cards => cards.map(c => c.id === newFlipped[0] || c.id === newFlipped[1] ? { ...c, matched: true } : c));
          setMemoryMatches(memoryMatches + 1);
          setMemoryFlipped([]);
        }, 600);
      } else {
        setTimeout(() => {
          setMemoryCards(cards => cards.map(c => c.flipped && !c.matched ? { ...c, flipped: false } : c));
          setMemoryFlipped([]);
        }, 1200);
      }
    }
  };

  const resetGames = () => {
    setTttBoard(Array(9).fill(null));
    setTttIsXNext(true);
    setTttWinner(null);
    setMemoryCards([]);
    setMemoryFlipped([]);
    setMemoryMatches(0);
    setMemoryTimeLeft(180);
    setMemoryTimerActive(false);
    setMemoryGameOver(false);
  };

  return (
    <>
      {/* SEMUA STYLE DI SINI - LANGSUNG DI DALAM COMPONENT */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 20px 0;
          background-color: #111827;
          color: #f3f4f6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          text-align: center;
        }
        h1 { font-size: 48px; margin: 40px 0; }
        h2 { font-size: 80px; margin: 40px 0; }
        input {
          width: 90%;
          max-width: 400px;
          padding: 18px;
          margin: 12px auto;
          display: block;
          background: #374151;
          border: none;
          border-radius: 16px;
          color: #f3f4f6;
          font-size: 18px;
        }
        button {
          width: 90%;
          max-width: 400px;
          padding: 20px;
          margin: 20px auto;
          display: block;
          background: #4b5563;
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }
        button:hover { background: #6b7280; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 300px; margin: 20px auto; }
        .memory-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 400px; margin: 20px auto; }
        .card {
          height: 80px;
          font-size: 40px;
          background: #1f2937;
          color: #f3f4f6;
          border-radius: 16px;
          border: 3px solid #6b7280;
          cursor: pointer;
        }
        .timer { font-size: 28px; font-weight: bold; margin: 20px 0; }
        .timer.low { color: #ef4444; }
        .big-games { font-size: 100px; background: none; border: none; cursor: pointer; margin-top: 80px; }
      `}</style>

      {/* HOME */}
      {!currentGame && !showGamesMenu && (
        <>
          <h1>Cek Jodoh</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="nama km cth : icha"
              value={nama1}
              onChange={(e) => setNama1(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="nama pasanganmu cth : sena"
              value={nama2}
              onChange={(e) => setNama2(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Menghitung...' : 'Cek Sekarang'}
            </button>
          </form>
          {result && (
            <>
              <h2>{result}%</h2>
              <button onClick={() => setShowGamesMenu(true)} className="big-games">
                🎮 Games
              </button>
            </>
          )}
        </>
      )}

      {/* MENU GAME */}
      {showGamesMenu && !currentGame && (
        <>
          <h1>Pilih Game Seru!</h1>
          <button onClick={() => { setCurrentGame('ttt'); setShowGamesMenu(false); }}>
            Tic-Tac-Toe
          </button>
          <button onClick={() => { setCurrentGame('memory'); setShowGamesMenu(false); startMemoryGame(); }}>
            Memory Match
          </button>
          <button onClick={backToHome}>Kembali</button>
        </>
      )}

      {/* GAMES */}
      {currentGame && (
        <>
          <button onClick={backToHome}>← Back to Home</button>

          {currentGame === 'ttt' && (
            <>
              <h1>Tic-Tac-Toe</h1>
              <p>Bergantian isi kotak. Dapat 3 simbol sejajar = menang! Kalah = traktir pasangan ya 😏</p>
              <p>Giliran: {tttIsXNext ? 'X' : 'O'}</p>
              {tttWinner && <p style={{fontSize:'30px', color:'#10b981'}}>Pemenang: {tttWinner} 🎉</p>}
              {!tttWinner && tttBoard.every(c => c !== null) && <p style={{fontSize:'30px'}}>Seri! 🤝</p>}
              <div className="grid">
                {tttBoard.map((cell, i) => (
                  <button key={i} onClick={() => handleTttClick(i)} className="card">
                    {cell}
                  </button>
                ))}
              </div>
            </>
          )}

          {currentGame === 'memory' && (
            <>
              <h1>Memory Match 💕</h1>
              <p>Cocokkan semua pasangan emoji romantis dalam 3 menit!</p>
              <p className={`timer ${memoryTimeLeft <= 30 ? 'low' : ''}`}>
                Waktu tersisa: {formatTime(memoryTimeLeft)}
              </p>
              <p>Pasangan ditemukan: {memoryMatches}/8</p>
              {memoryGameOver && <p style={{fontSize:'32px', color:'#ef4444'}}>Waktu Habis! Kamu Kalah 😭</p>}
              {memoryMatches === 8 && <p style={{fontSize:'32px', color:'#10b981'}}>Selamat! Kamu Menang 🎉</p>}
              <div className="memory-grid">
                {memoryCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleMemoryFlip(card.id)}
                    disabled={memoryGameOver || memoryMatches === 8}
                    className="card"
                    style={{background: card.flipped || card.matched ? '#374151' : '#1f2937'}}
                  >
                    {card.flipped || card.matched ? card.value : '?'}
                  </button>
                ))}
              </div>
              {(memoryGameOver || memoryMatches === 8) && (
                <button onClick={resetMemoryGame}>
                  Main Lagi
                </button>
              )}
            </>
          )}
        </>
      )}
    </>
  );
  }
