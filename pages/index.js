
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
    setResult(`Hasil kecocokan: ${data.result}`);
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
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', color: '#fff', marginBottom: '10px' }}>
        ❤️ Cek Jodoh ❤️
      </h1>
      <p style={{ fontSize: '20px', color: '#fff', marginBottom: '40px' }}>
        Masukkan dua nama untuk hitung kecocokan
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Nama pertama (contoh: Sena )"
          value={nama1}
          onChange={(e) => setNama1(e.target.value)}
          required
          style={{
            padding: '15px',
            margin: '10px',
            width: '350px',
            maxWidth: '90%',
            fontSize: '18px',
            borderRadius: '10px',
            border: 'none'
          }}
        />
        <input
          type="text"
          placeholder="Nama kedua (contoh: Icha)"
          value={nama2}
          onChange={(e) => setNama2(e.target.value)}
          required
          style={{
            padding: '15px',
            margin: '10px',
            width: '350px',
            maxWidth: '90%',
            fontSize: '18px',
            borderRadius: '10px',
            border: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px 40px',
            fontSize: '20px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          {loading ? 'Menghitung...' : 'Cek Jodoh'}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '50px',
          padding: '30px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '20px',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#ff6b6b'
        }}>
          {result}
        </div>
      )}
    </div>
  );
}
