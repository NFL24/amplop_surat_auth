import { useState, useEffect } from 'react'
import './App.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY_FORM = { name: '', email: '', password: '' }

const CLOSE_DURATION = 1700 // surat masuk amplop + tutup amplop menutup
const LEAVE_DURATION = 900 // amplop turun ke bawah

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('login') // login atau register
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [userName, setUserName] = useState('')
  // idle -> closing -> leaving -> welcome
  const [phase, setPhase] = useState('idle')

  const isRegister = mode === 'register'

  // Mengatur urutan transisi setelah form berhasil dikirim
  useEffect(() => {
    if (phase === 'closing') {
      const t = setTimeout(() => setPhase('leaving'), CLOSE_DURATION)
      return () => clearTimeout(t)
    }
    if (phase === 'leaving') {
      const t = setTimeout(() => setPhase('welcome'), LEAVE_DURATION)
      return () => clearTimeout(t)
    }
  }, [phase])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isRegister && form.name.trim() === '') {
      return setError('Nama belum diisi.')
    }
    if (!EMAIL_RE.test(form.email)) {
      return setError('Format email belum benar. Contoh: nama@email.com')
    }
    if (form.password.length < 6) {
      return setError('Kata sandi minimal 6 karakter.')
    }

    setError('')
    setUserName(isRegister ? form.name.trim() : form.email.split('@')[0])
    setIsOpen(false) // surat masuk ke amplop, tutup amplop menutup
    setPhase('closing')
  }

  const toggleEnvelope = () => {
    if (phase !== 'idle') return // abaikan klik saat transisi berjalan

    if (isOpen) {
      setIsOpen(false)
    } else {
      // setiap amplop dibuka, mulai dari form kosong
      setForm(EMPTY_FORM)
      setError('')
      setMode('login')
      setIsOpen(true)
    }
  }

  const handleLogout = () => {
    setForm(EMPTY_FORM)
    setError('')
    setMode('login')
    setIsOpen(false)
    setPhase('idle')
  }

  /* HALAMAN SETELAH LOGIN / REGISTER */
  if (phase === 'welcome') {
    return (
      <div className="scene scene-welcome">
        <main className="welcome">
          <div className="welcome-icon">✉</div>
          <h1>Selamat datang, {userName}!</h1>
          <p>
            {isRegister
              ? 'Akunmu berhasil dibuat. Suratmu sudah sampai dengan selamat.'
              : 'Kamu berhasil masuk. Suratmu sudah sampai dengan selamat.'}
          </p>
          <button type="button" className="submit welcome-btn" onClick={handleLogout}>
            Keluar
          </button>
        </main>
      </div>
    )
  }

  /* AMPLOP */
  return (
    <div className="scene">
      <div className={`stage ${phase === 'leaving' ? 'leaving' : ''}`}>
        <p className="caption">haloo!</p>

        <div className={`envelope ${isOpen ? 'open' : ''}`}>
          {/* Kertas berisi formulir */}
          <div className="paper">
            <div className="paper-content">
              <h2 className="paper-title">Welcome</h2>

              <div className="tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isRegister}
                  className={`tab ${!isRegister ? 'active' : ''}`}
                  onClick={() => switchMode('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isRegister}
                  className={`tab ${isRegister ? 'active' : ''}`}
                  onClick={() => switchMode('register')}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {isRegister && (
                  <div className="field">
                    <label htmlFor="name">Nama</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nama lengkapmu"
                      autoComplete="off"
                    />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    autoComplete="off"
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Kata sandi</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                  />
                </div>

                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="submit">
                  {isRegister ? 'Daftar' : 'Masuk'}
                </button>
              </form>
            </div>
          </div>

          {/* Bagian depan amplop (bentuk V) */}
          <div className="pocket" aria-hidden="true">
            <div className="stamp">✉</div>
            <div className="address">
              <span>Kepada:</span>
              <span className="address-name">Kamu yang di sana</span>
            </div>
          </div>

          {/* Tutup amplop */}
          <div className="flap" aria-hidden="true" />

          {/* Segel */}
          <div className="seal" aria-hidden="true" onClick={toggleEnvelope}>
            ♥
          </div>
        </div>

        <button
          type="button"
          className="toggle-btn"
          onClick={toggleEnvelope}
          disabled={phase !== 'idle'}
        >
          {isOpen ? 'Tutup surat' : 'Buka surat'}
        </button>
      </div>
    </div>
  )
}

export default App