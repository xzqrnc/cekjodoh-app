
import { useState } from 'react';

export default function Home() {
  const [nama1, setNama1] = useState('');
  const [nama2, setNama2] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

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
    setResult(`Hasil kecocokan: ${data.result}% ❤️`);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ff9a9e, #fad0c4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '50px', color: '#fff', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        ❤️ Cek Jodoh ❤️
      </h1>
      <p style={{ fontSize: '22px', color: '#fff', marginBottom: '40px' }}>
        Masukkan dua nama untuk melihat kecocokan kalian
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Nama pertama (contoh: Hasena Rashid)"
          value={nama1}
          onChange={(e) => setNama1(e.target.value)}
          required
          style={{
            padding: '15px',
            margin: '10px 0',
            width: '380px',
            maxWidth: '90%',
            fontSize: '18px',
            borderRadius: '15px',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}
        />
        <input
          type="text"
          placeholder="Nama kedua (contoh: Icha Dewi Cahya)"
          value={nama2}
          onChange={(e) => setNama2(e.target.value)}
          required
          style={{
            padding: '15px',
            margin: '10px 0',
            width: '380px',
            maxWidth: '90%',
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
            background: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            marginTop: '20px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Menghitung...' : 'Cek Sekarang'}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '30px',
          fontSize: '60px',
          fontWeight: 'bold',
          color: '#ff4757',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          minWidth: '300px',
          textAlign: 'center'
        }}>
          {result}
        </div>
      )}
    </div>
  );
}
