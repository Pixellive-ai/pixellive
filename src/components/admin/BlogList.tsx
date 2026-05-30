import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { GlassCard } from '@/components/ui/glass-card'
import { BlogForm } from './BlogForm'
import { toast } from 'sonner'
import { Edit2, Trash2, ExternalLink, Plus, Search } from 'lucide-react'
import { useSafeMutation, useSafeQuery } from '@/lib/convex'

interface AdminBlogPost {
  _id: string
  title: string
  slug: string
  category: string
  published: boolean
  publishedAt?: number
}

export function BlogList() {
  const posts = useSafeQuery(api.blog.listAll)
  const removePost = useSafeMutation(api.blog.remove)
  
  const [editingPost, setEditingPost] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const safePosts = (posts ?? []) as AdminBlogPost[]

  const handleDelete = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await removePost({ id })
        toast.success('Post deleted')
      } catch (error) {
        toast.error('Failed to delete post')
      }
    }
  }

  const filteredPosts = safePosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:border-neon/50 outline-none"
          />
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-2 bg-neon text-white font-semibold rounded-lg hover:bg-neon/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </button>
      </div>

      <GlassCard className="border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="text-left p-4 text-sm font-semibold text-muted">Title</th>
                <th className="text-left p-4 text-sm font-semibold text-muted">Category</th>
                <th className="text-left p-4 text-sm font-semibold text-muted">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-muted">Date</th>
                <th className="text-right p-4 text-sm font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!posts ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-neon/20 border-t-neon rounded-full animate-spin" />
                      Loading posts...
                    </div>
                  </td>
                </tr>
              ) : filteredPosts?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    No posts found.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-[var(--fg)]">{post.title}</div>
                      <div className="text-xs text-muted truncate max-w-[200px]">{post.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md bg-neon/10 border border-neon/20 text-neon text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 text-xs ${post.published ? 'text-green-400' : 'text-amber-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="p-2 text-muted hover:text-neon transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted hover:text-white transition-colors"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-muted hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {(isCreating || editingPost) && (
        <BlogForm
          initialData={editingPost}
          onClose={() => {
            setIsCreating(false)
            setEditingPost(null)
          }}
          onSuccess={() => {
            setIsCreating(false)
            setEditingPost(null)
          }}
        />
      )}
    </div>
  )
}
