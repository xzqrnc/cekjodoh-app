import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

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
    <div className={styles.container}>
      <Head>
        <title>Cek Jodoh App</title>
        <meta name="description" content="Cek kecocokan nama pasangan" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Cek Jodoh</h1>
        <p className={styles.description}>Masukkan dua nama untuk hitung kecocokan</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nama pertama (contoh: Hasena Rashid)"
            value={nama1}
            onChange={(e) => setNama1(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Nama kedua (contoh: Icha Dewi Cahya)"
            value={nama2}
            onChange={(e) => setNama2(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Menghitung...' : 'Cek Jodoh'}
          </button>
        </form>

        {result && <div className={styles.result}>{result}</div>}
      </main>
    </div>
  );
    }
