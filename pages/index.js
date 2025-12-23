
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
  const baseEmojis = ['❤️', '💑', '😘', '💕', '🌹', '💏', '🥰', '💖'];
  const fullEmojis = [...baseEmojis, ...baseEmojis]; // 16 kartu, 8 pasangan identik
  const [memoryCards, setMemoryCards] = useState([]);
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [memoryMatches, setMemoryMatches] = useState(0);

  // Timer untuk Memory Match (3 menit = 180 detik)
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

  const resetGames = () => {
    setTttBoard(Array(9).fill(null));
    setTttIsXNext(true);
    setTttWinner(null);

    // Reset Memory Match
    const shuffled = fullEmojis
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }));
    setMemoryCards(shuffled);
    setMemoryFlipped([]);
    setMemoryMatches(0);
    setMemoryTimeLeft(180);
    setMemoryTimerActive(false);
    setMemoryGameOver(false);
  };

  // Timer countdown untuk Memory Match
  useEffect(() => {
    if (memoryTimerActive && memoryTimeLeft > 0) {
      const timer = setTimeout(() => {
        setMemoryTimeLeft(memoryTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (memoryTimeLeft === 0 && memoryTimerActive) {
      setMemoryGameOver(true);
      setMemoryTimerActive(false);
    }
  }, [memoryTimeLeft, memoryTimerActive]);

  // Mulai timer saat pilih Memory Match
  const startMemoryGame = () => {
    resetGames();
    setMemoryTimerActive(true);
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

  // Memory Match
  const handleMemoryFlip = (id) => {
    if (memoryFlipped.length === 2 || memoryCards.find(c => c.id === id)?.matched || memoryGameOver) return;

    const newCards = memoryCards.map(card => card.id === id ? { ...card, flipped: true } : card);
    setMemoryCards(newCards);

    const newFlipped = [...memoryFlipped, id];
    setMemoryFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const first = memoryCards.find(c => c.id === newFlipped[0]);
      const second = newCards.find(c => c.id === id);

      if (first.value === second.value) {
        setTimeout(() => {
          setMemoryCards(cards => cards.map(c => c.id === newFlipped[0] || c.id === id ? { ...c, matched: true } : c));
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

  // Format waktu
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `\( {m}: \){s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #111827, #1f2937)',
      color: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* HOME */}
      {!currentGame && !showGamesMenu && (
        <>
          <h1 style={{ fontSize: 'clamp(48px, 12vw, 72px)', fontWeight: 'bold', color: '#f43f5e', marginBottom: '50px' }}>
            Cek Jodoh
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
              <input placeholder="Nama kamu" value={nama1} onChange={(e) => setNama1(e.target.value)} required style={{ width: '100%', padding: '18px', margin: '12px 0', background: '#374151', border: 'none', borderRadius: '16px', color: '#f3f4f6', fontSize: '18px' }} />
              <input placeholder="Nama pasanganmu" value={nama2} onChange={(e) => setNama2(e.target.value)} required style={{ width: '100%', padding: '18px', margin: '12px 0', background: '#374151', border: 'none', borderRadius: '16px', color: '#f3f4f6', fontSize: '18px' }} />
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '18px', marginTop: '20px', background: '#f43f5e', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '20px', fontWeight: 'bold'
              }}>
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
                boxShadow: '0 0 60px rgba(244, 63, 94, 0.6)'
              }}>
                {result}%
              </div>

              <button onClick={() => setShowGamesMenu(true)} style={{ marginTop: '80px', fontSize: '100px', background: 'none', border: 'none', cursor: 'pointer' }}>
                🎮
              </button>
            </>
          )}
        </>
      )}

      {/* MENU GAME */}
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
          <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '40px' }}>Pilih Game Seru!</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <button onClick={() => { setCurrentGame('ttt'); setShowGamesMenu(false); }} style={{ padding: '40px', fontSize: '24px', background: '#374151', color: '#f3f4f6', borderRadius: '20px', border: 'none' }}>Tic-Tac-Toe</button>
            <button onClick={() => { setCurrentGame('memory'); setShowGamesMenu(false); startMemoryGame(); }} style={{ padding: '40px', fontSize: '24px', background: '#374151', color: '#f3f4f6', borderRadius: '20px', border: 'none' }}>Memory Match</button>
          </div>
          <button onClick={backToHome} style={{ marginTop: '60px', fontSize: '60px', background: 'none', border: 'none' }}>❤️</button>
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

          {currentGame === 'ttt' && (
            <>
              <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Tic-Tac-Toe</h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '40px' }}>
                Bergantian isi kotak. Dapat 3 simbol sejajar = menang! Kalah = traktir pasangan ya 😘
              </p>
              <p style={{ fontSize: '22px' }}>Giliran: <strong style={{ color: '#f43f5e' }}>{tttIsXNext ? 'X' : 'O'}</strong></p>
              {tttWinner && <p style={{ fontSize: '34px', color: '#f43f5e', margin: '20px 0' }}>Pemenang: {tttWinner} 🎉</p>}
              {!tttWinner && tttBoard.every(c => c) && <p style={{ fontSize: '34px', color: '#9ca3af' }}>Seri! 🤝</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', margin: '40px 0' }}>
                {tttBoard.map((cell, i) => (
                  <button key={i} onClick={() => handleTttClick(i)} style={{
                    height: '90px', fontSize: '50px', background: '#1f2937', color: '#f3f4f6', borderRadius: '16px', border: '3px solid #6b7280', cursor: 'pointer'
                  }}>
                    {cell}
                  </button>
                ))}
              </div>
            </>
          )}

          {currentGame === 'memory' && (
            <>
              <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Memory Match</h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '20px' }}>
                Cocokkan pasangan emoji romantis dalam 3 menit! Kalau habis waktu = kalah 😢
              </p>
              <p style={{ fontSize: '28px', color: memoryTimeLeft <= 30 ? '#f43f5e' : '#f3f4f6', marginBottom: '30px' }}>
                Waktu tersisa: <strong>{formatTime(memoryTimeLeft)}</strong>
              </p>
              <p style={{ fontSize: '22px' }}>Pasangan ditemukan: <strong style={{ color: '#f43f5e' }}>{memoryMatches}/8</strong></p>

              {memoryGameOver && <p style={{ fontSize: '34px', color: '#f43f5e', margin: '30px 0' }}>Waktu Habis! Kalah 😭</p>}
              {memoryMatches === 8 && !memoryGameOver && <p style={{ fontSize: '34px', color: '#f43f5e', margin: '30px 0' }}>Selamat! Menang dalam waktu ❤️</p>}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', margin: '40px 0' }}>
                {memoryCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleMemoryFlip(card.id)}
                    disabled={memoryGameOver || memoryMatches === 8}
                    style={{
                      height: '70px',
                      fontSize: '40px',
                      background: card.flipped || card.matched ? '#374151' : '#1f2937',
                      color: '#f3f4f6',
                      borderRadius: '16px',
                      border: '3px solid #6b7280',
                      cursor: memoryGameOver || memoryMatches === 8 ? 'not-allowed' : 'pointer',
                      opacity: memoryGameOver || memoryMatches === 8 ? 0.6 : 1
                    }}
                  >
                    {card.flipped || card.matched ? card.value : '?'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
