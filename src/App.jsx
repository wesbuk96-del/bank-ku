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

  // Data profil pengguna
  const [profil, setProfil] = useState({
    nama: 'Andre Wijaya',
    email: 'andre@gmail.com',
    telepon: '081234567890',
    alamat: 'Jl. Mawar No. 10, Yogyakarta'
  })
  const [editProfil, setEditProfil] = useState(false)
  const [profilTemp, setProfilTemp] = useState(profil)

  // Data tagihan
  const [tagihan, setTagihan] = useState([
    { id: 1, nama: 'PLN Listrik', kode: '5217840192', nominal: 150000, kategori: '⚡', status: 'belum' },
    { id: 2, nama: 'PDAM Air', kode: '93810284', nominal: 85000, kategori: '💧', status: 'belum' },
    { id: 3, nama: 'Indihome Internet', kode: '0274123456', nominal: 350000, kategori: '🌐', status: 'lunas' },
  ])
  const [pesanTagihan, setPesanTagihan] = useState('')

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

  function bayarTagihan(t) {
    if (t.status === 'lunas') return
    if (saldo < t.nominal) { setPesanTagihan('Saldo tidak cukup untuk bayar ' + t.nama + '!'); return }
    setSaldo(saldo - t.nominal)
    setTagihan(tagihan.map(x => x.id === t.id ? { ...x, status: 'lunas' } : x))
    setRiwayat([{ id: riwayat.length + 1, nama: 'Bayar ' + t.nama, jumlah: t.nominal, masuk: false, tanggal: 'Hari ini' }, ...riwayat])
    setPesanTagihan('Tagihan ' + t.nama + ' berhasil dibayar!')
  }

  function simpanProfil() {
    setProfil(profilTemp)
    setEditProfil(false)
  }

  const navBtn = (nama, label) => (
    <button onClick={() => { setHalaman(nama); setPesan(''); setPesanTagihan('') }}
      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${halaman === nama ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
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

        <div className="flex gap-2 mb-5 flex-wrap">
          {navBtn('beranda', 'Beranda')}
          {navBtn('transfer', 'Transfer')}
          {navBtn('riwayat', 'Riwayat')}
          {navBtn('tagihan', 'Tagihan')}
          {navBtn('profil', 'Profil')}
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

            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { icon: '↑', label: 'Transfer', page: 'transfer' },
                { icon: '📋', label: 'Tagihan', page: 'tagihan' },
                { icon: '📜', label: 'Riwayat', page: 'riwayat' },
                { icon: '👤', label: 'Profil', page: 'profil' },
              ].map(m => (
                <button key={m.page} onClick={() => setHalaman(m.page)}
                  className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center gap-1 hover:bg-gray-50">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-xs text-gray-500">{m.label}</span>
                </button>
              ))}
            </div>

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

        {halaman === 'tagihan' && (
          <div>
            <p className="text-xs text-gray-400 mb-1">Saldo tersedia</p>
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Rp {saldo.toLocaleString('id-ID')}</h3>
            {pesanTagihan && (
              <div className={`text-sm rounded-lg px-3 py-2.5 mb-4 ${pesanTagihan.includes('berhasil') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {pesanTagihan}
              </div>
            )}
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {tagihan.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">
                      {t.kategori}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{t.nama}</div>
                      <div className="text-xs text-gray-400">{t.kode}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">Rp {t.nominal.toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                  {t.status === 'lunas' ? (
                    <span className="text-xs font-medium text-green-500 bg-green-50 px-3 py-1 rounded-full">Lunas</span>
                  ) : (
                    <button onClick={() => bayarTagihan(t)}
                      className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">
                      Bayar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {halaman === 'profil' && (
          <div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {profil.nama.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{profil.nama}</div>
                  <div className="text-xs text-gray-400">Nasabah Bank Ku</div>
                  <div className="text-xs text-gray-400 mt-0.5">Rek: 1234567890</div>
                </div>
              </div>

              {editProfil ? (
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Nama lengkap</label>
                  <input value={profilTemp.nama} onChange={(e) => setProfilTemp({...profilTemp, nama: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <label className="text-xs text-gray-400 block mb-1">Email</label>
                  <input value={profilTemp.email} onChange={(e) => setProfilTemp({...profilTemp, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <label className="text-xs text-gray-400 block mb-1">Nomor telepon</label>
                  <input value={profilTemp.telepon} onChange={(e) => setProfilTemp({...profilTemp, telepon: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <label className="text-xs text-gray-400 block mb-1">Alamat</label>
                  <input value={profilTemp.alamat} onChange={(e) => setProfilTemp({...profilTemp, alamat: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="flex gap-2">
                    <button onClick={simpanProfil} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Simpan</button>
                    <button onClick={() => { setEditProfil(false); setProfilTemp(profil) }} className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-sm">Batal</button>
                  </div>
                </div>
              ) : (
                <div>
                  {[
                    { label: 'Nama lengkap', value: profil.nama },
                    { label: 'Email', value: profil.email },
                    { label: 'Nomor telepon', value: profil.telepon },
                    { label: 'Alamat', value: profil.alamat },
                  ].map((item) => (
                    <div key={item.label} className="py-2.5 border-b border-gray-50 last:border-0">
                      <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                      <div className="text-sm text-gray-700">{item.value}</div>
                    </div>
                  ))}
                  <button onClick={() => { setEditProfil(true); setProfilTemp(profil) }}
                    className="w-full mt-4 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">
                    Edit profil
                  </button>
                </div>
              )}
            </div>

            <button onClick={onLogout} className="w-full bg-red-50 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100">
              Keluar dari akun
            </button>
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