import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Zap } from 'lucide-react'
import { useAdminAuth } from '../AdminAuth'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 400))
    const ok = login(password)
    setLoading(false)
    if (ok) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 relative overflow-hidden">
      <div className="bg-grid-pattern absolute inset-0 opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,240,255,0.06) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neon/10 border border-neon/30 mb-4">
            <Zap className="w-7 h-7 text-neon" />
          </div>
          <h1 className="text-2xl font-black">Admin Access</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">PIXEL<span className="text-neon">LIVE</span> Production</p>
        </div>

        {/* Form */}
        <div className="glass-panel rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--glass)] border border-[var(--border-color)] focus:outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
                  tabIndex={-1}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-neon text-white hover:bg-neon/90 transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                'Enter Admin Panel'
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-4">
          <a href="/" className="hover:text-neon transition-colors">← Back to site</a>
        </p>
      </motion.div>
    </div>
  )
}
