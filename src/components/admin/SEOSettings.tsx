import { useState, useEffect } from 'react'
import { api } from '../../../convex/_generated/api'
import { GlassCard } from '@/components/ui/glass-card'
import { toast } from 'sonner'
import { Save, Info } from 'lucide-react'
import { useSafeMutation, useSafeQuery } from '@/lib/convex'

export function SEOSettings() {
  const robotsTxt = useSafeQuery(api.seo.get, { key: 'robots.txt' })
  const setSeo = useSafeMutation(api.seo.set)
  
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (robotsTxt !== undefined) {
      setContent(robotsTxt || 'User-agent: *\nAllow: /')
    }
  }, [robotsTxt])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await setSeo({ key: 'robots.txt', value: content })
      toast.success('SEO settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Global SEO Management</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-neon text-white font-semibold rounded-lg hover:bg-neon/90 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard className="p-6 border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Robots.txt</h3>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Info className="w-3 h-3" />
                <span>Controls how search engines crawl your site</span>
              </div>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={12}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon/50 outline-none font-mono text-sm leading-relaxed"
              placeholder="User-agent: *..."
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-white/10 bg-neon/5">
          <div className="flex gap-4">
            <div className="p-3 rounded-full bg-neon/10 h-fit">
              <Info className="w-6 h-6 text-neon" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-neon">SEO Pro Tip</h4>
              <p className="text-sm text-muted leading-relaxed">
                Ensure your <code className="text-neon/80 bg-neon/5 px-1 rounded">robots.txt</code> is correctly configured to allow search engines to find your sitemap. 
                Individual blog SEO (meta titles, keywords, etc.) can be managed within each post's editor.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
