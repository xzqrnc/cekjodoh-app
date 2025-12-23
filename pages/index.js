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
    setResult(`Hasil kecocokan: ${data.result}% 💙`);
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
        background: '#3d5a80',
        color: '#e0fbfc',
        border: '3px solid #98c1d9',
        cursor: 'pointer',
        boxShadow: '0 0 15px rgba(152, 193, 217, 0.5)'
      }}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  return (
    <>
      <style jsx global>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 10px #98c1d9, 0 0 20px #ee6c4d;
          }
          to {
            text-shadow: 0 0 20px #98c1d9, 0 0 30px #ee6c4d;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #293241, #3d5a80)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
        color: '#e0fbfc'
      }}>
        {!isGameMode ? (
          // TAB JODOH
          <>
            <h1 style={{
              fontSize: 'clamp(40px, 10vw, 60px)',
              color: '#98c1d9',
              textAlign: 'center',
              fontStyle: 'italic',
              animation: 'glow 2s ease-in-out infinite alternate',
              marginBottom: '20px'
            }}>
              💙 Cek Jodoh 💙
            </h1>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '400px'
            }}>
              <input
                type="text"
                placeholder="Nama kamu"
                value={nama1}
                onChange={(e) => setNama1(e.target.value)}
                required
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  width: '100%',
                  fontSize: '18px',
                  borderRadius: '12px',
                  border: '2px solid #98c1d9',
                  background: '#3d5a80',
                  color: '#e0fbfc',
                  boxShadow: '0 0 10px rgba(152, 193, 217, 0.3)'
                }}
              />
              <input
                type="text"
                placeholder="Nama pasanganmu"
                value={nama2}
                onChange={(e) => setNama2(e.target.value)}
                required
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  width: '100%',
                  fontSize: '18px',
                  borderRadius: '12px',
                  border: '2px solid #98c1d9',
                  background: '#3d5a80',
                  color: '#e0fbfc',
                  boxShadow: '0 0 10px rgba(152, 193, 217, 0.3)'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '15px 40px',
                  fontSize: '20px',
                  background: '#ee6c4d',
                  color: '#293241',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  boxShadow: '0 0 15px rgba(238, 108, 77, 0.6)',
                  fontWeight: 'bold'
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
                  background: 'rgba(61, 90, 128, 0.7)',
                  borderRadius: '20px',
                  fontSize: 'clamp(40px, 15vw, 70px)',
                  fontWeight: 'bold',
                  color: '#e0fbfc',
                  textAlign: 'center',
                  minWidth: '280px',
                  animation: 'glow 2s ease-in-out infinite alternate',
                  fontStyle: 'italic'
                }}>
                  {result}
                </div>

                <button
                  onClick={() => { setIsGameMode(true); resetGame(); }}
                  style={{
                    marginTop: '50px',
                    padding: '20px',
                    fontSize: '40px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  🎮
                </button>
              </>
            )}
          </>
        ) : (
          // TAB GAME
          <div style={{
            padding: '30px',
            background: 'rgba(41, 50, 65, 0.9)',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(152, 193, 217, 0.4)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h2 style={{
              color: '#98c1d9',
              fontSize: 'clamp(30px, 8vw, 40px)',
              fontStyle: 'italic',
              animation: 'glow 2s ease-in-out infinite alternate'
            }}>
              Tic-Tac-Toe
            </h2>
            <p style={{ fontSize: '18px' }}>
              Giliran: <strong style={{ color: '#ee6c4d' }}>{isXNext ? 'X' : 'O'}</strong>
            </p>
            {winner && <p style={{ fontSize: '28px', color: '#ee6c4d', animation: 'glow 1.5s infinite' }}>Pemenang: {winner} 🎉</p>}
            {!winner && board.every(square => square !== null) && <p style={{ fontSize: '28px', color: '#98c1d9' }}>Seri! 🤝</p>}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              margin: '30px auto',
              width: '100%',
              maxWidth: '300px',
              aspectRatio: '1/1'
            }}>
              {Array(9).fill(null).map((_, i) => renderSquare(i))}
            </div>

            <button
              onClick={resetGame}
              style={{
                padding: '15px',
                fontSize: '36px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              🔄
            </button>

            <button
              onClick={() => setIsGameMode(false)}
              style={{
                marginTop: '40px',
                padding: '20px',
                fontSize: '40px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ❤
            </button>
          </div>
        )}
      </div>
    </>
  );
}
