import { useState } from 'react';

export default function Home() {
  const [nama1, setNama1] = useState('');
  const [nama2, setNama2] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // State untuk Tic-Tac-Toe
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setShowGame(false);

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
        background: '#fff',
        border: '3px solid #333',
        cursor: 'pointer'
      }}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontSize: 'clamp(40px, 10vw, 60px)',
        color: '#fff',
        marginBottom: '10px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        💙 Cek Jodoh 💙
      </h1>
      <p style={{
        fontSize: 'clamp(18px, 5vw, 22px)',
        color: '#fff',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
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
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
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
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px 50px',
            fontSize: '20px',
            background: '#00BFFF',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            marginTop: '20px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
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
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '30px',
            fontSize: 'clamp(40px, 15vw, 70px)',
            fontWeight: 'bold',
            color: '#00BFFF',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            textAlign: 'center',
            minWidth: '280px'
          }}>
            {result}
          </div>

          <button
            onClick={() => { setShowGame(true); resetGame(); }}
            style={{
              marginTop: '40px',
              padding: '15px 30px',
              fontSize: '18px',
              background: '#1E90FF',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            Main Game Bareng Yuk! 🎮
          </button>
        </>
      )}

      {showGame && (
        <div style={{
          marginTop: '50px',
          padding: '30px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#00BFFF', fontSize: 'clamp(24px, 8vw, 30px)' }}>Tic-Tac-Toe (XOX)</h2>
          <p style={{ fontSize: '18px' }}>Giliran: <strong>{isXNext ? 'X' : 'O'}</strong></p>
          {winner && <p style={{ fontSize: '28px', color: '#FF4500' }}>Pemenang: {winner} 🎉</p>}
          {!winner && board.every(square => square !== null) && <p style={{ fontSize: '28px' }}>Seri! 🤝</p>}

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
            background: '#FF6347',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
          }
