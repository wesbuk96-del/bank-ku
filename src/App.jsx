import { useState } from 'react'

function HalamanLogin({ onLogin }) {
  const [rekening, setRekening] = useState('')
  const [pin, setPin] = useState('')
  const [pesan, setPesan] = useState('')
  const [loading, setLoading] = useState(false)

  function login() {
    if (!rekening || !pin) {
      setPesan('Isi semua kolom dulu!')
      return
    }
    if (pin.length < 6) {
      setPesan('PIN minimal 6 angka!')
      return
    }

    setLoading(true)
    setTimeout(() => {
      if (rekening === '1234567890' && pin === '123456') {
        onLogin(rekening)
      } else {
        setPesan('Nomor rekening atau PIN salah!')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div style={{
      fontFamily: 'sans-serif',
      background: '#f5f7fa',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '360px',
        border: '1px solid #eee'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#1a56db',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '24px'
          }}>
            🏦
          </div>
          <h2 style={{ margin: '0 0 4px' }}>Bank Ku</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
            Masuk ke akun kamu
          </p>
        </div>

        <label style={{ fontSize: '13px', color: '#555' }}>
          Nomor rekening
        </label>
        <input
          type="text"
          placeholder="Contoh: 1234567890"
          value={rekening}
          onChange={(e) => setRekening(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            marginTop: '6px',
            marginBottom: '16px',
            boxSizing: 'border-box'
          }}
        />

        <label style={{ fontSize: '13px', color: '#555' }}>
          PIN
        </label>
        <input
          type="password"
          placeholder="Masukkan 6 digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            marginTop: '6px',
            marginBottom: '16px',
            boxSizing: 'border-box'
          }}
        />

        {pesan !== '' && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: '#ffebee',
            color: '#c62828',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {pesan}
          </div>
        )}

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#93c5fd' : '#1a56db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Memverifikasi...' : 'Masuk'}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#aaa',
          marginTop: '16px',
          marginBottom: 0
        }}>
          Rekening: 1234567890 · PIN: 123456
        </p>

      </div>
    </div>
  )
}

function HalamanUtama({ namaUser, onLogout, saldo, setSaldo, riwayat, setRiwayat }) {
  const [halaman, setHalaman] = useState('beranda')
  const [nominal, setNominal] = useState('')
  const [rekening, setRekening] = useState('')
  const [pesan, setPesan] = useState('')

  function transfer() {
    const jumlah = Number(nominal)
    if (!rekening) { setPesan('Isi nomor rekening tujuan!'); return }
    if (!jumlah || jumlah <= 0) { setPesan('Isi nominal dulu!'); return }
    if (jumlah > saldo) { setPesan('Saldo tidak cukup!'); return }

    setSaldo(saldo - jumlah)
    setPesan('Transfer Rp ' + jumlah.toLocaleString('id-ID') + ' berhasil!')
    setRiwayat([{
      id: riwayat.length + 1,
      nama: 'Transfer ke ' + rekening,
      jumlah,
      masuk: false,
      tanggal: 'Hari ini'
    }, ...riwayat])
    setNominal('')
    setRekening('')
  }

  const tombolNav = (nama, label) => (
    <button
      onClick={() => { setHalaman(nama); setPesan('') }}
      style={{
        padding: '8px 14px',
        borderRadius: '8px',
        border: 'none',
        background: halaman === nama ? '#1a56db' : '#eee',
        color: halaman === nama ? 'white' : '#333',
        cursor: 'pointer',
        fontSize: '13px'
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      fontFamily: 'sans-serif',
      background: '#f5f7fa',
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '400px',
      margin: '0 auto'
    }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{ margin: 0 }}>Bank Ku</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#888' }}>
            Halo, {namaUser}
          </span>
          <button
            onClick={onLogout}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              background: 'white',
              color: '#666',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Keluar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {tombolNav('beranda', 'Beranda')}
        {tombolNav('transfer', 'Transfer')}
        {tombolNav('riwayat', 'Riwayat')}
      </div>

      {halaman === 'beranda' && (
        <div>
          <div style={{
            background: '#1a56db',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px',
            color: 'white'
          }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8 }}>
              Saldo rekening
            </p>
            <h2 style={{ margin: '0 0 4px', fontSize: '28px' }}>
              Rp {saldo.toLocaleString('id-ID')}
            </h2>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
              **** **** **** 4821
            </p>
          </div>

          <h4 style={{ margin: '0 0 10px', color: '#555' }}>Transaksi terakhir</h4>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '0 16px',
            border: '1px solid #eee'
          }}>
            {riwayat.slice(0, 3).map((tx) => (
              <div key={tx.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f5f5f5',
                fontSize: '14px'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{tx.nama}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>{tx.tanggal}</div>
                </div>
                <span style={{ color: tx.masuk ? 'green' : 'red', fontWeight: '500' }}>
                  {tx.masuk ? '+' : '-'}Rp {tx.jumlah.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setHalaman('riwayat')}
            style={{
              width: '100%', marginTop: '12px', padding: '10px',
              background: 'white', border: '1px solid #ddd',
              borderRadius: '8px', color: '#1a56db',
              cursor: 'pointer', fontSize: '14px'
            }}
          >
            Lihat semua riwayat →
          </button>
        </div>
      )}

      {halaman === 'transfer' && (
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '20px', border: '1px solid #eee'
        }}>
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>Saldo tersedia</p>
          <h3 style={{ margin: '0 0 20px', color: '#1a56db' }}>
            Rp {saldo.toLocaleString('id-ID')}
          </h3>

          <label style={{ fontSize: '13px', color: '#555' }}>Nomor rekening tujuan</label>
          <input
            type="text"
            placeholder="Contoh: 1234567890"
            value={rekening}
            onChange={(e) => setRekening(e.target.value)}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '14px',
              marginTop: '6px', marginBottom: '14px', boxSizing: 'border-box'
            }}
          />

          <label style={{ fontSize: '13px', color: '#555' }}>Nominal transfer</label>
          <input
            type="number"
            placeholder="Contoh: 500000"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '14px',
              marginTop: '6px', marginBottom: '14px', boxSizing: 'border-box'
            }}
          />

          {pesan !== '' && (
            <p style={{
              padding: '10px', borderRadius: '8px',
              background: pesan.includes('berhasil') ? '#e8f5e9' : '#ffebee',
              color: pesan.includes('berhasil') ? 'green' : 'red',
              fontSize: '13px', marginBottom: '14px'
            }}>
              {pesan}
            </p>
          )}

          <button
            onClick={transfer}
            style={{
              width: '100%', padding: '12px', background: '#1a56db',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '15px', cursor: 'pointer'
            }}
          >
            Kirim Transfer
          </button>
        </div>
      )}

      {halaman === 'riwayat' && (
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '0 16px', border: '1px solid #eee'
        }}>
          <div style={{
            padding: '14px 0', borderBottom: '1px solid #f0f0f0',
            fontSize: '14px', fontWeight: '500', color: '#555'
          }}>
            Semua transaksi ({riwayat.length})
          </div>
          {riwayat.map((tx) => (
            <div key={tx.id} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '12px 0',
              borderBottom: '1px solid #f5f5f5', fontSize: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: tx.masuk ? '#e8f5e9' : '#ffebee',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px'
                }}>
                  {tx.masuk ? '↓' : '↑'}
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>{tx.nama}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>{tx.tanggal}</div>
                </div>
              </div>
              <span style={{ color: tx.masuk ? 'green' : 'red', fontWeight: '500' }}>
                {tx.masuk ? '+' : '-'}Rp {tx.jumlah.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

function App() {
  const [sudahLogin, setSudahLogin] = useState(false)
  const [namaUser, setNamaUser] = useState('')
  const [saldo, setSaldo] = useState(12500000)
  const [riwayat, setRiwayat] = useState([
    { id: 1, nama: 'Gaji masuk', jumlah: 8000000, masuk: true, tanggal: '1 Mei 2026' },
    { id: 2, nama: 'Indomaret', jumlah: 87000, masuk: false, tanggal: '3 Mei 2026' },
    { id: 3, nama: 'Transfer masuk - Ayah', jumlah: 500000, masuk: true, tanggal: '5 Mei 2026' },
  ])

  function handleLogin(rek) {
    setNamaUser(rek)
    setSudahLogin(true)
  }

  function handleLogout() {
    setSudahLogin(false)
    setNamaUser('')
  }

  if (!sudahLogin) {
    return <HalamanLogin onLogin={handleLogin} />
  }

  return (
    <HalamanUtama
      namaUser={namaUser}
      onLogout={handleLogout}
      saldo={saldo}
      setSaldo={setSaldo}
      riwayat={riwayat}
      setRiwayat={setRiwayat}
    />
  )
}

export default App