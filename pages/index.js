import { useState } from 'react';

export default function Home() {
  const [nama1, setNama1] = useState('');
  const [nama2, setNama2] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGameMode, setIsGameMode] = useState(false);

  // State untuk Tic-Tac-Toe
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

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
    setResult(`Hasil kecocokan: ${data.result}% 🌊`);
    setLoading(false);
  };

  // Logika Tic-Tac-Toe
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const newWinner = calculateWinner(newBoard);
    setWinner(newWinner);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (i) => (
    <button
      style={{
        width: '100%',
        height: '80px',
        fontSize: '40px',
        background: '#0f172a',
        color: '#00ffff',
        border: '3px solid #1e3a8a',
        cursor: 'pointer',
        boxShadow: '0 0 10px #00ffff'
      }}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  const glowStyle = {
    fontStyle: 'italic',
    animation: 'glow 2s ease-in-out infinite alternate'
  };

  return (
    <>
      <style jsx global>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 10px #fff, 0 0 20px #00ffff, 0 0 30px #00ffff;
          }
          to {
            text-shadow: 0 0 20px #fff, 0 0 30px #00ffff, 0 0 40px #00ffff;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0f172a, #1e3a8a)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
        color: '#e0fbfc'
      }}>
        {/* Tombol Tab Switch */}
        <button
          onClick={() => { setIsGameMode(!isGameMode); resetGame(); }}
          style={{
            position: 'absolute',
            top: '20px',
            padding: '10px 30px',
            fontSize: '18px',
            background: '#1e40af',
            color: '#fff',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 0 15px #00ffff'
          }}
        >
          {isGameMode ? 'Kembali ke Jodoh' : 'Main Game'}
        </button>

        {!isGameMode ? (
          // TAB JODOH
          <>
            <h1 style={{ ...glowStyle, fontSize: 'clamp(40px, 10vw, 60px)', color: '#00ffff', textAlign: 'center' }}>
              🌊 Cek Jodoh 🌊
            </h1>
            <p style={{ fontSize: 'clamp(18px, 5vw, 22px)', marginBottom: '40px', textAlign: 'center' }}>
              Masukkan dua nama untuk melihat kecocokan kalian
            </p>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '500px'
            }}>
              <input
                type="text"
                placeholder="Nama pertama (contoh: sena)"
                value={nama1}
                onChange={(e) => setNama1(e.target.value)}
                required
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  width: '100%',
                  fontSize: '18px',
                  borderRadius: '15px',
                  border: '2px solid #00ffff',
                  background: '#1e293b',
                  color: '#e0fbfc',
                  boxShadow: '0 0 10px #00ffff'
                }}
              />
              <input
                type="text"
                placeholder="Nama kedua (contoh: icha)"
                value={nama2}
                onChange={(e) => setNama2(e.target.value)}
                required
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  width: '100%',
                  fontSize: '18px',
                  borderRadius: '15px',
                  border: '2px solid #00ffff',
                  background: '#1e293b',
                  color: '#e0fbfc',
                  boxShadow: '0 0 10px #00ffff'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '15px 50px',
                  fontSize: '20px',
                  background: '#1e40af',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  boxShadow: '0 0 20px #00ffff',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                {loading ? 'Menghitung...' : 'Cek Sekarang'}
              </button>
            </form>

            {result && (
              <>
                <div style={{
                  marginTop: '60px',
                  padding: 'clamp(20px, 8vw, 40px)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '30px',
                  fontSize: 'clamp(40px, 15vw, 70px)',
                  fontWeight: 'bold',
                  color: '#00ffff',
                  boxShadow: '0 0 30px #00ffff',
                  textAlign: 'center',
                  minWidth: '280px',
                  ...glowStyle
                }}>
                  {result}
                </div>

                {!isGameMode && (
                  <button
                    onClick={() => { setIsGameMode(true); resetGame(); }}
                    style={{
                      marginTop: '40px',
                      padding: '15px 30px',
                      fontSize: '18px',
                      background: '#1e40af',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      boxShadow: '0 0 20px #00ffff'
                    }}
                  >
                    Main Game Bareng Yuk! 🎮
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          // TAB GAME
          <div style={{
            padding: '30px',
            background: 'rgba(15, 23, 42, 0.9)',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 0 30px #00ffff',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h2 style={{ ...glowStyle, color: '#00ffff', fontSize: 'clamp(30px, 8vw, 40px)' }}>
              Tic-Tac-Toe (XOX)
            </h2>
            <p style={{ fontSize: '18px' }}>Giliran: <strong style={{ color: '#00ffff' }}>{isXNext ? 'X' : 'O'}</strong></p>
            {winner && <p style={{ fontSize: '28px', color: '#ff0040', ...glowStyle }}>Pemenang: {winner} 🎉</p>}
            {!winner && board.every(square => square !== null) && <p style={{ fontSize: '28px', ...glowStyle }}>Seri! 🤝</p>}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              margin: '20px auto',
              width: '100%',
              maxWidth: '300px',
              aspectRatio: '1/1'
            }}>
              {Array(9).fill(null).map((_, i) => renderSquare(i))}
            </div>

            <button onClick={resetGame} style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              marginTop: '20px',
              boxShadow: '0 0 15px #ff0040'
            }}>
              Reset Game
            </button>
          </div>
        )}
      </div>
    </>
  );
          }
