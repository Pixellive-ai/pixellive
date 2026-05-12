import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BackgroundBeams } from '@/components/ui/bg-beams'
import { GlassCard } from '@/components/ui/glass-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { PageTransition } from '@/components/ui/page-transition'
import { toast } from 'sonner'
import { LogIn, LayoutDashboard, FileText, Settings, LogOut, ChevronRight, Users, MessageSquare } from 'lucide-react'
import { BlogList } from '@/components/admin/BlogList'
import { SEOSettings } from '@/components/admin/SEOSettings'
import { api } from '../../convex/_generated/api'
import { isConvexConfigured, useSafeQuery } from '@/lib/convex'

// Simple password for now as requested
const ADMIN_PASSWORD = 'Arjun123'
const ADMIN_SESSION_KEY = 'plp-admin-auth'

interface AdminBlogPost {
  published?: boolean
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'blog' | 'seo'>('dashboard')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
      setIsAuthenticated(true)
      toast.success('Access granted')
    } else {
      toast.error('Invalid password')
      setPassword('')
    }
  }

  const posts = useSafeQuery(api.blog.listAll)
  const contacts = useSafeQuery(api.contact.listAll)
  const safePosts = (posts ?? []) as AdminBlogPost[]

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(ADMIN_SESSION_KEY) === '1')
  }, [])

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen relative flex items-center justify-center p-4">
          <BackgroundBeams />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md relative z-10"
          >
            <GlassCard className="p-8 border-neon/20">
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 rounded-full bg-neon/10 border border-neon/20">
                  <LogIn className="w-8 h-8 text-neon" />
                </div>
                <div className="text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">
                    Admin Portal
                  </h1>
                  <p className="text-muted mt-2">Enter credentials to continue</p>
                </div>
                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-neon/50 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-neon hover:bg-neon/90 text-black font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  >
                    Authenticate
                  </button>
                </form>
              </div>
              <BorderBeam />
            </GlassCard>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
        <BackgroundBeams className="-z-10" />
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)]">
                Admin <span className="text-neon">Dashboard</span>
              </h1>
              <p className="text-muted mt-2">Manage your agency's presence and content.</p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem(ADMIN_SESSION_KEY)
                setIsAuthenticated(false)
              }}
              className="flex items-center gap-2 text-muted hover:text-[var(--fg)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>

          {!isConvexConfigured && (
            <GlassCard className="p-4 border-yellow-500/30 bg-yellow-500/5">
              <p className="text-sm text-yellow-300">
                Convex not connected. Admin is visible in demo mode, but blog/SEO changes will not persist.
                Add <code className="mx-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-xs">VITE_CONVEX_URL</code>
                in <code className="mx-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-xs">.env.local</code> and run
                <code className="mx-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-xs">npx convex dev</code>.
              </p>
            </GlassCard>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-2">
              <SidebarItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Overview"
                isActive={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />
              <SidebarItem
                icon={<FileText className="w-5 h-5" />}
                label="Blog Management"
                isActive={activeTab === 'blog'}
                onClick={() => setActiveTab('blog')}
              />
              <SidebarItem
                icon={<Settings className="w-5 h-5" />}
                label="SEO & Global"
                isActive={activeTab === 'seo'}
                onClick={() => setActiveTab('seo')}
              />
            </aside>

            {/* Main Content */}
            <main className="space-y-6">
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard 
                    label="Total Blogs" 
                    value={posts?.length.toString() || '0'} 
                    icon={<FileText className="w-5 h-5" />}
                  />
                  <StatCard 
                    label="Drafts" 
                    value={safePosts.filter((p) => !p.published).length.toString()} 
                    icon={<FileText className="w-5 h-5 text-amber-500" />}
                  />
                  <StatCard 
                    label="Contact Leads" 
                    value={(contacts?.length ?? 0).toString()}
                    icon={<MessageSquare className="w-5 h-5 text-blue-500" />}
                  />
                  <div className="md:col-span-3">
                    <GlassCard className="p-8 border-white/10 min-h-[300px] flex flex-col items-center justify-center text-center gap-4">
                      <div className="p-4 rounded-full bg-neon/10 border border-neon/20">
                        <Users className="w-8 h-8 text-neon" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Welcome back, Arjun</h3>
                        <p className="text-muted max-w-md mx-auto mt-2">
                          Everything is running smoothly. You have {safePosts.filter((p) => !p.published).length} drafts waiting to be published.
                        </p>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {activeTab === 'blog' && <BlogList />}

              {activeTab === 'seo' && <SEOSettings />}
            </main>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function SidebarItem({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
        isActive
          ? 'bg-neon/10 border border-neon/20 text-neon'
          : 'hover:bg-white/5 border border-transparent text-muted hover:text-[var(--fg)]'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
    </button>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <GlassCard className="p-6 border-white/10 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted mb-1">{label}</p>
        <p className="text-3xl font-bold text-neon">{value}</p>
      </div>
    </GlassCard>
  )
}
