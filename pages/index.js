
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
  const fullEmojis = [...baseEmojis, ...baseEmojis];
  const [memoryCards, setMemoryCards] = useState([]);
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [memoryMatches, setMemoryMatches] = useState(0);
  const [memoryTimeLeft, setMemoryTimeLeft] = useState(180); // 3 menit
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

    const shuffled = fullEmojis.sort(() => Math.random() - 0.5).map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    }));
    setMemoryCards(shuffled);
    setMemoryFlipped([]);
    setMemoryMatches(0);
    setMemoryTimeLeft(180);
    setMemoryTimerActive(false);
    setMemoryGameOver(false);
  };

  const startMemoryGame = () => {
    resetGames();
    setMemoryTimerActive(true);
  };

  // Timer countdown
  useEffect(() => {
    if (memoryTimerActive && memoryTimeLeft > 0 && memoryMatches < 8) {
      const timer = setTimeout(() => setMemoryTimeLeft(memoryTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (memoryTimeLeft === 0 && memoryTimerActive) {
      setMemoryGameOver(true);
      setMemoryTimerActive(false);
    }
  }, [memoryTimeLeft, memoryTimerActive, memoryMatches]);

  // Format waktu MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `\( {m}: \){s < 10 ? '0' + s : s}`;
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
      {/* HOME - sama seperti sebelumnya */}
      {!currentGame && !showGamesMenu && (
        // ... (kode home sama persis seperti versi sebelumnya)
        // saya singkat di sini biar ga panjang, tapi copy dari kode sebelumnya ya
      )}

      {/* MENU GAME */}
      {showGamesMenu && !currentGame && (
        // ... (sama)
      )}

      {/* MEMORY MATCH - dengan timer fix */}
      {currentGame === 'memory' && (
        <>
          <h2 style={{ fontSize: '40px', color: '#f43f5e', marginBottom: '20px' }}>Memory Match</h2>
          <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '20px' }}>
            Cocokkan pasangan emoji romantis dalam 3 menit! Kalau habis waktu = kalah 😢
          </p>
          <p style={{ fontSize: '32px', color: memoryTimeLeft <= 30 ? '#f43f5e' : '#f3f4f6', marginBottom: '30px' }}>
            Waktu tersisa: <strong>{formatTime(memoryTimeLeft)}</strong>
          </p>
          <p style={{ fontSize: '22px' }}>Pasangan ditemukan: <strong style={{ color: '#f43f5e' }}>{memoryMatches}/8</strong></p>

          {memoryGameOver && <p style={{ fontSize: '34px', color: '#f43f5e', margin: '30px 0' }}>Waktu Habis! Kalah 😭</p>}
          {memoryMatches === 8 && <p style={{ fontSize: '34px', color: '#f43f5e', margin: '30px 0' }}>Selamat! Menang dalam waktu ❤️</p>}

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
                  cursor: memoryGameOver || memoryMatches === 8 ? 'not-allowed' : 'pointer'
                }}
              >
                {card.flipped || card.matched ? card.value : '?'}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Tic-Tac-Toe - sama seperti sebelumnya */}
      {currentGame === 'ttt' && (
        // ... kode Tic-Tac-Toe sama
      )}
    </div>
  );
}
