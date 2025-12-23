'use client';

import { useState, useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

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
      aspectRatio: '1/1',
      fontSize: 'clamp(30px, 10vw, 50px)',
      background: 'rgba(61,90,128,0.3)',
      color: '#e0fbfc',
      border: '2px solid rgba(152,193,217,0.5)',
      borderRadius: '16px',
      cursor: 'pointer',
      boxShadow: 'inset 0 0 20px rgba(152,193,217,0.2)',
      transition: 'all 0.3s'
    }} onClick={() => handleClick(i)}>
      {board[i]}
    </button>
  );

  const isDraw = !winner && board.every(square => square !== null);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#293241', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: '#293241' } },
          fpsLimit: 120,
          interactivity: { detectsOn: 'canvas', events: { resize: true } },
          particles: {
            color: { value: '#98c1d9' },
            links: { color: '#98c1d9', distance: 140, enable: true, opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1.5, direction: 'none', random: false, straight: false },
            number: { density: { enable: true, area: 800 }, value: 60 },
            opacity: { value: { min: 0.3, max: 0.7 } },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 4 } }
          }
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        {!isGameMode ? (
          <>
            <h1 style={{
              fontSize: 'clamp(42px, 10vw, 64px)',
              color: '#98c1d9',
              fontStyle: 'italic',
              fontWeight: '600',
              letterSpacing: '2px',
              textShadow: '0 0 20px rgba(152,193,217,0.8)',
              marginBottom: '50px',
              textAlign: 'center'
            }}>
              💙 Cek Jodoh 💙
            </h1>

            <div style={{
              background: 'rgba(61,90,128,0.25)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(152,193,217,0.3)',
              borderRadius: '24px',
              padding: '40px 30px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(152,193,217,0.3)'
            }}>
              <form onSubmit={handleSubmit}>
                <input placeholder="Nama kamu" value={nama1} onChange={(e) => setNama1(e.target.value)} required style={{
                  width: '100%', padding: '16px', margin: '12px 0', background: 'rgba(41,50,65,0.6)', border: '1px solid rgba(152,193,217,0.5)', borderRadius: '16px', color: '#e0fbfc', fontSize: '18px'
                }} />
                <input placeholder="Nama pasanganmu" value={nama2} onChange={(e) => setNama2(e.target.value)} required style={{
                  width: '100%', padding: '16px', margin: '12px 0', background: 'rgba(41,50,65,0.6)', border: '1px solid rgba(152,193,217,0.5)', borderRadius: '16px', color: '#e0fbfc', fontSize: '18px'
                }} />
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '16px', marginTop: '20px', background: '#ee6c4d', color: '#293241', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '20px', boxShadow: '0 0 25px rgba(238,108,77,0.7)', cursor: 'pointer'
                }}>
                  {loading ? 'Menghitung...' : 'Cek Sekarang'}
                </button>
              </form>
            </div>

            {result && (
              <>
                <div style={{
                  marginTop: '70px',
                  padding: '40px',
                  background: 'rgba(61,90,128,0.3)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '30px',
                  fontSize: 'clamp(42px,15vw,72px)',
                  color: '#e0fbfc',
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  textShadow: '0 0 40px rgba(152,193,217,0.9)',
                  textAlign: 'center',
                  boxShadow: '0 0 50px rgba(152,193,217,0.5)'
                }}>
                  {result}
                </div>

                <button onClick={() => { setIsGameMode(true); resetGame(); }} style={{ marginTop: '70px', fontSize: '60px', background: 'none', border: 'none', cursor: 'pointer' }}>🎮</button>
              </>
            )}
          </>
        ) : (
          <div style={{
            background: 'rgba(41,50,65,0.5)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(152,193,217,0.4)',
            borderRadius: '30px',
            padding: '50px 30px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(152,193,217,0.6)'
          }}>
            <h2 style={{ color: '#98c1d9', fontSize: 'clamp(32px,8vw,44px)', fontStyle: 'italic', fontWeight: '600', textShadow: '0 0 20px rgba(152,193,217,0.8)' }}>
              Tic-Tac-Toe
            </h2>
            <p style={{ color: '#e0fbfc', fontSize: '20px', margin: '20px 0' }}>
              Giliran: <strong style={{ color: '#ee6c4d' }}>{isXNext ? 'X' : 'O'}</strong>
            </p>

            {winner && <p style={{ fontSize: '32px', color: '#ee6c4d', textShadow: '0 0 30px #ee6c4d', margin: '20px 0' }}>Pemenang: {winner} 🎉</p>}
            {isDraw && <p style={{ fontSize: '32px', color: '#98c1d9', textShadow: '0 0 30px #98c1d9', margin: '20px 0' }}>Seri! 🤝</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', margin: '30px 0' }}>
              {Array(9).fill(null).map((_, i) => renderSquare(i))}
            </div>

            <button onClick={resetGame} style={{ fontSize: '48px', background: 'none', border: 'none', cursor: 'pointer', margin: '20px 0' }}>🔄</button>
            <button onClick={() => setIsGameMode(false)} style={{ fontSize: '60px', background: 'none', border: 'none', cursor: 'pointer' }}>❤</button>
          </div>
        )}
      </div>
    </div>
  );
}
