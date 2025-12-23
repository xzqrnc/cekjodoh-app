
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

  // Format waktu MM:SS - ini kunci fix bug!
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
    // ... (kode return lengkap sama seperti versi sebelumnya, tapi dengan {formatTime(memoryTimeLeft)} di tampilan timer)
    // Pastikan di bagian Memory Match:
    <p style={{ fontSize: '32px', color: memoryTimeLeft <= 30 ? '#f43f5e' : '#f3f4f6', marginBottom: '30px' }}>
      Waktu tersisa: <strong>{formatTime(memoryTimeLeft)}</strong>
    </p>
  );
}
