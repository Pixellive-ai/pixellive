import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../../convex/_generated/api'
import { GlassCard } from '@/components/ui/glass-card'
import { useSafeMutation, useSafeQuery } from '@/lib/convex'

const CATEGORIES = ['All', 'Video', 'SEO', 'Ads', 'Content', 'Strategy']
const CATEGORY_COLORS: Record<string, string> = {
  Video: '#00F0FF', SEO: '#7B61FF', Ads: '#FF61DC',
  Content: '#FFB800', Strategy: '#00FF94',
}

export default function AdminBlogs() {
  const posts = useSafeQuery(api.blog.listAll)
  const removePost = useSafeMutation(api.blog.remove)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = (posts ?? []).filter((p: any) => {
    const matchCat = category === 'All' || p.category === category
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await removePost({ id: id as any })
      toast.success('Post deleted.')
    } catch {
      toast.error('Failed to delete post.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black">Blog Posts</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            {posts === undefined ? '...' : `${posts.length} total · ${posts.filter((p: any) => p.published).length} published`}
          </p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-neon text-black hover:bg-neon/90 transition-all hover:shadow-[0_0_16px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[var(--glass)] border border-[var(--border-color)] focus:outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 text-[var(--fg)] placeholder:text-[var(--muted)] transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${category === cat ? 'bg-neon text-black' : 'glass-panel border border-[var(--border-color)] text-[var(--fg-muted)] hover:border-neon/30'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        {posts === undefined ? (
          <div className="flex items-center justify-center py-20 gap-2 text-[var(--fg-muted)]">
            <Loader2 className="w-5 h-5 text-neon animate-spin" />
            <span className="text-sm">Loading posts…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[var(--fg-muted)] text-sm">
            {posts.length === 0
              ? <span>No posts yet. <Link to="/admin/blogs/new" className="text-neon hover:underline">Create your first →</Link></span>
              : 'No posts match your filters.'}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 py-3 border-b border-[var(--border-color)] grid grid-cols-[1fr_120px_100px_80px_80px] gap-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              <span>Title</span>
              <span>Category</span>
              <span>Author</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {filtered.map((post: any) => (
                <div
                  key={post._id}
                  className="px-5 py-4 grid grid-cols-[1fr_120px_100px_80px_80px] gap-3 items-center hover:bg-[var(--glass)] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{post.title}</p>
                    <p className="text-xs text-[var(--muted)] truncate mt-0.5">{post.slug}</p>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full w-fit"
                    style={{
                      background: `${CATEGORY_COLORS[post.category] ?? '#888'}15`,
                      color: CATEGORY_COLORS[post.category] ?? '#888',
                      border: `1px solid ${CATEGORY_COLORS[post.category] ?? '#888'}25`,
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--fg-muted)] truncate">{post.author}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    {post.published
                      ? <><Eye className="w-3 h-3 text-green-400" /><span className="text-green-400">Live</span></>
                      : <><EyeOff className="w-3 h-3 text-yellow-400" /><span className="text-yellow-400">Draft</span></>
                    }
                  </span>
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      to={`/admin/blogs/${post._id}`}
                      className="w-7 h-7 rounded-lg glass-panel border border-[var(--border-color)] flex items-center justify-center hover:border-neon/40 hover:text-neon transition-colors text-[var(--fg-muted)]"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id, post.title)}
                      disabled={deleting === post._id}
                      className="w-7 h-7 rounded-lg glass-panel border border-[var(--border-color)] flex items-center justify-center hover:border-red-500/40 hover:text-red-400 transition-colors text-[var(--fg-muted)] disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === post._id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </GlassCard>
    </div>
  )
}
