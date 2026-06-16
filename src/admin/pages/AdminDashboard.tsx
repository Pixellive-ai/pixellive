import { Link } from 'react-router-dom'
import { FileText, Mail, Users, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { GlassCard } from '@/components/ui/glass-card'
import { useSafeQuery } from '@/lib/convex'

export default function AdminDashboard() {
  const posts = useSafeQuery(api.blog.listAll)
  const submissions = useSafeQuery(api.contact.listAll)
  const subscribers = useSafeQuery(api.newsletter.listAll)

  const published = posts?.filter((p: any) => p.published).length ?? 0
  const drafts = (posts?.length ?? 0) - published

  const stats = [
    { label: 'Total Posts', value: posts?.length ?? '—', sub: `${published} published · ${drafts} drafts`, icon: FileText, color: '#00F0FF' },
    { label: 'Contact Submissions', value: submissions?.length ?? '—', sub: 'All time', icon: Mail, color: '#FF61DC' },
    { label: 'Newsletter Subscribers', value: subscribers?.length ?? '—', sub: 'Unique emails', icon: Users, color: '#7B61FF' },
    { label: 'Published This Month', value: posts?.filter((p: any) => p.publishedAt && p.publishedAt > Date.now() - 30 * 86400000).length ?? '—', sub: 'Last 30 days', icon: TrendingUp, color: '#00FF94' },
  ]

  const recent = [...(posts ?? [])].slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Dashboard</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">Overview of your Pixellive content.</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-neon text-white hover:bg-neon/90 transition-all hover:shadow-[0_0_16px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <GlassCard key={stat.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-sm font-semibold">{stat.label}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{stat.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* Recent posts */}
      <GlassCard className="overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="font-bold text-sm">Recent Posts</h2>
          <Link to="/admin/blogs" className="text-xs text-neon hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-10 text-center text-[var(--fg-muted)] text-sm">
            No posts yet. <Link to="/admin/blogs/new" className="text-neon hover:underline">Create your first post →</Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {recent.map((post: any) => (
              <div key={post._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[var(--glass)] transition-colors">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{post.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{post.category} · {post.author}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <Link
                    to={`/admin/blogs/${post._id}`}
                    className="text-xs text-neon hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
