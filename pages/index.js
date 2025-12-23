'use client';

import { useState, useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect } from 'react';

export default function Home() {
  const [nama1, setNama1] = useState('');
  const [nama2, setNama2] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGameMode, setIsGameMode] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama1, nama2 }),
    });

    const data = await res.json();
    setResult(`Hasil kecocokan: ${data.result}% 💙`);
    setLoading(false);
  };

  const calculateWinner = (squares) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setWinner(calculateWinner(newBoard));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (i) => (
    <button style={{
      width: '100%',
      height: '80px',
      fontSize: '40px',
      background: 'rgba(61,90,128,0.4)',
      color: '#e0fbfc',
      border: '2px solid #98c1d9',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 0 15px rgba(152,193,217,0.5)'
    }} onClick={() => handleClick(i)}>
      {board[i]}
    </button>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#293241', overflow: 'hidden' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: '#293241' } },
          fpsLimit: 120,
          particles: {
            color: { value: '#98c1d9' },
            links: { color: '#98c1d9', distance: 150, enable: true, opacity: 0.3, width: 1 },
            move: { enable: true, speed: 2 },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.5 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } }
          },
          detectRetina: true
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        {!isGameMode ? (
          <>
            <h1 style={{
              fontSize: 'clamp(40px, 10vw, 60px)',
              color: '#98c1d9',
              fontStyle: 'italic',
              textShadow: '0 0 20px #98c1d9',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              💙 Cek Jodoh 💙
            </h1>

            <div style={{
              background: 'rgba(61,90,128,0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(152,193,217,0.3)',
              borderRadius: '20px',
              padding: '40px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 0 30px rgba(152,193,217,0.4)'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <input placeholder="Nama kamu" value={nama1} onChange={(e) => setNama1(e.target.value)} required style={{
                  padding: '15px', margin: '10px 0', background: 'rgba(41,50,65,0.6)', border: '1px solid #98c1d9', borderRadius: '12px', color: '#e0fbfc', fontSize: '18px'
                }} />
                <input placeholder="Nama pasanganmu" value={nama2} onChange={(e) => setNama2(e.target.value)} required style={{
                  padding: '15px', margin: '10px 0', background: 'rgba(41,50,65,0.6)', border: '1px solid #98c1d9', borderRadius: '12px', color: '#e0fbfc', fontSize: '18px'
                }} />
                <button type="submit" disabled={loading} style={{
                  padding: '15px', marginTop: '20px', background: '#ee6c4d', color: '#293241', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '20px', boxShadow: '0 0 20px rgba(238,108,77,0.6)'
                }}>
                  {loading ? 'Menghitung...' : 'Cek Sekarang'}
                </button>
              </form>
            </div>

            {result && (
              <>
                <div style={{
                  marginTop: '60px',
                  padding: '30px',
                  background: 'rgba(61,90,128,0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  fontSize: 'clamp(40px,15vw,70px)',
                  color: '#e0fbfc',
                  fontStyle: 'italic',
                  textShadow: '0 0 30px #98c1d9',
                  textAlign: 'center',
                  boxShadow: '0 0 40px rgba(152,193,217,0.5)'
                }}>
                  {result}
                </div>

                <button onClick={() => { setIsGameMode(true); resetGame(); }} style={{
                  marginTop: '60px', fontSize: '50px', background: 'transparent', border: 'none', cursor: 'pointer'
                }}>🎮</button>
              </>
            )}
          </>
        ) : (
          <div style={{
            background: 'rgba(41,50,65,0.6)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(152,193,217,0.4)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(152,193,217,0.5)'
          }}>
            <h2 style={{ color: '#98c1d9', fontSize: 'clamp(30px,8vw,40px)', fontStyle: 'italic', textShadow: '0 0 20px #98c1d9' }}>
              Tic-Tac-Toe
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', margin: '30px 0' }}>
              {Array(9).fill(null).map((_, i) => renderSquare(i))}
            </div>
            <button onClick={resetGame} style={{ fontSize: '40px', background: 'transparent', border: 'none', cursor: 'pointer' }}>🔄</button>
            <button onClick={() => setIsGameMode(false)} style={{ marginTop: '40px', fontSize: '50px', background: 'transparent', border: 'none', cursor: 'pointer' }}>❤</button>
          </div>
        )}
      </div>
    </div>
  );
                     }
