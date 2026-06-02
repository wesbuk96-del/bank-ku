import { useState, useEffect } from 'react'

function HalamanLogin({ onLogin }) {
  const [rekening, setRekening] = useState('')
  const [pin, setPin] = useState('')
  const [pesan, setPesan] = useState('')
  const [loading, setLoading] = useState(false)

  function login() {
    if (!rekening || !pin) { setPesan('Isi semua kolom dulu!'); return }
    if (pin.length < 6) { setPesan('PIN minimal 6 angka!'); return }
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🏦</div>
          <h2 className="text-xl font-semibold text-gray-800">Bank Ku</h2>
          <p className="text-sm text-gray-400 mt-1">Masuk ke akun kamu</p>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500 mb-1 block">Nomor rekening</label>
          <input type="text" placeholder="Contoh: 1234567890" value={rekening} onChange={(e) => setRekening(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500 mb-1 block">PIN</label>
          <input type="password" placeholder="Masukkan 6 digit PIN" value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {pesan && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2.5 mb-4">{pesan}</div>}
        <button onClick={login} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:bg-blue-300">
          {loading ? 'Memverifikasi...' : 'Masuk'}
        </button>
        <p className="text-center text-xs text-gray-300 mt-4">Rekening: 1234567890 · PIN: 123456</p>
      </div>
    </div>
  )
}

function HalamanUtama({ namaUser, onLogout }) {
  const [halaman, setHalaman] = useState('beranda')
  const [nominal, setNominal] = useState('')
  const [rekening, setRekening] = useState('')
  const [pesan, setPesan] = useState('')
  const [saldo, setSaldo] = useState(0)
  const [riwayat, setRiwayat] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setSaldo(12500000)
      setRiwayat([
        { id: 1, nama: 'Gaji masuk', jumlah: 8000000, masuk: true, tanggal: '1 Mei 2026' },
        { id: 2, nama: 'Indomaret', jumlah: 87000, masuk: false, tanggal: '3 Mei 2026' },
        { id: 3, nama: 'Transfer masuk - Ayah', jumlah: 500000, masuk: true, tanggal: '5 Mei 2026' },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  function transfer() {
    const jumlah = Number(nominal)
    if (!rekening) { setPesan('Isi nomor rekening tujuan!'); return }
    if (!jumlah || jumlah <= 0) { setPesan('Isi nominal dulu!'); return }
    if (jumlah > saldo) { setPesan('Saldo tidak cukup!'); return }
    setSaldo(saldo - jumlah)
    setPesan('Transfer Rp ' + jumlah.toLocaleString('id-ID') + ' berhasil!')
    setRiwayat([{ id: riwayat.length + 1, nama: 'Transfer ke ' + rekening, jumlah, masuk: false, tanggal: 'Hari ini' }, ...riwayat])
    setNominal('')
    setRekening('')
  }

  const navBtn = (nama, label) => (
    <button onClick={() => { setHalaman(nama); setPesan('') }}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${halaman === nama ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Bank Ku</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Halo, {namaUser}</span>
            <button onClick={onLogout} className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100">Keluar</button>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {navBtn('beranda', 'Beranda')}
          {navBtn('transfer', 'Transfer')}
          {navBtn('riwayat', 'Riwayat')}
        </div>

        {halaman === 'beranda' && (
          <div>
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <p className="text-xs text-gray-400 mb-2">Memuat data saldo...</p>
                <div className="h-8 bg-gray-100 rounded animate-pulse mb-1 w-48"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-32"></div>
              </div>
            ) : (
              <div className="bg-blue-600 rounded-2xl p-6 mb-4 text-white">
                <p className="text-xs text-blue-200 mb-1">Saldo rekening</p>
                <h2 className="text-3xl font-semibold mb-1">Rp {saldo.toLocaleString('id-ID')}</h2>
                <p className="text-xs text-blue-300">**** **** **** 4821</p>
              </div>
            )}

            <h4 className="text-sm font-medium text-gray-400 mb-2">Transaksi terakhir</h4>
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {loading ? (
                [1,2,3].map(i => (
                  <div key={i} className="flex justify-between items-center px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-20"></div>
                  </div>
                ))
              ) : (
                riwayat.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700">{tx.nama}</div>
                      <div className="text-xs text-gray-300">{tx.tanggal}</div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.masuk ? 'text-green-500' : 'text-red-400'}`}>
                      {tx.masuk ? '+' : '-'}Rp {tx.jumlah.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setHalaman('riwayat')} className="w-full mt-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm text-blue-600 hover:bg-gray-50">
              Lihat semua riwayat →
            </button>
          </div>
        )}

        {halaman === 'transfer' && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Saldo tersedia</p>
            <h3 className="text-xl font-semibold text-blue-600 mb-5">Rp {saldo.toLocaleString('id-ID')}</h3>
            <label className="text-sm text-gray-500 block mb-1">Nomor rekening tujuan</label>
            <input type="text" placeholder="Contoh: 1234567890" value={rekening} onChange={(e) => setRekening(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <label className="text-sm text-gray-500 block mb-1">Nominal transfer</label>
            <input type="number" placeholder="Contoh: 500000" value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {pesan && (
              <div className={`text-sm rounded-lg px-3 py-2.5 mb-4 ${pesan.includes('berhasil') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{pesan}</div>
            )}
            <button onClick={transfer} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">Kirim Transfer</button>
          </div>
        )}

        {halaman === 'riwayat' && (
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            <div className="px-4 py-3 text-sm font-medium text-gray-400">Semua transaksi ({riwayat.length})</div>
            {riwayat.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${tx.masuk ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'}`}>
                    {tx.masuk ? '↓' : '↑'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{tx.nama}</div>
                    <div className="text-xs text-gray-300">{tx.tanggal}</div>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.masuk ? 'text-green-500' : 'text-red-400'}`}>
                  {tx.masuk ? '+' : '-'}Rp {tx.jumlah.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

function App() {
  const [sudahLogin, setSudahLogin] = useState(false)
  const [namaUser, setNamaUser] = useState('')

  if (!sudahLogin) {
    return <HalamanLogin onLogin={(rek) => { setNamaUser(rek); setSudahLogin(true) }} />
  }

  return (
    <HalamanUtama
      namaUser={namaUser}
      onLogout={() => { setSudahLogin(false); setNamaUser('') }}
    />
  )
}

export default App