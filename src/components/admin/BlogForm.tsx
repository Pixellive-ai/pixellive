import { useState, useRef } from 'react'
import { api } from '../../../convex/_generated/api'
import { GlassCard } from '@/components/ui/glass-card'
import { toast } from 'sonner'
import { X, Upload, Save, Trash2 } from 'lucide-react'
import { useSafeMutation } from '@/lib/convex'

interface BlogFormProps {
  initialData?: any
  onClose: () => void
  onSuccess: () => void
}

export function BlogForm({ initialData, onClose, onSuccess }: BlogFormProps) {
  const createPost = useSafeMutation(api.blog.create)
  const updatePost = useSafeMutation(api.blog.update)
  const generateUploadUrl = useSafeMutation(api.files.generateUploadUrl)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    author: initialData?.author || '',
    published: initialData?.published || false,
    featuredImage: initialData?.featuredImage || '',
    images: (initialData?.images as string[] | undefined) || [],
    videoUrl: initialData?.videoUrl || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    keywords: initialData?.keywords?.join(', ') || '',
    faqSchema: initialData?.faqSchema || '',
    customSchema: initialData?.customSchema || '',
  })

  const [uploadingTarget, setUploadingTarget] = useState<'featured' | 'gallery' | null>(null)
  const featuredFileInputRef = useRef<HTMLInputElement>(null)
  const galleryFileInputRef = useRef<HTMLInputElement>(null)

  const uploadOne = async (file: File) => {
    const uploadUrl = await generateUploadUrl({})
    const result = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    })

    if (!result.ok) {
      throw new Error(`Upload failed with status ${result.status}`)
    }

    const body = await result.json()
    return body.storageId as string
  }

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploadingTarget('featured')
    try {
      const storageId = await uploadOne(file)
      setFormData((prev) => ({ ...prev, featuredImage: storageId }))
      toast.success('Featured image uploaded')
    } catch (error) {
      toast.error('Featured image upload failed')
      console.error(error)
    } finally {
      setUploadingTarget(null)
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return

    setUploadingTarget('gallery')
    try {
      const uploadedIds = await Promise.all(files.map((file) => uploadOne(file)))
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedIds],
      }))
      toast.success(`${uploadedIds.length} image${uploadedIds.length > 1 ? 's' : ''} uploaded`)
    } catch (error) {
      toast.error('Gallery upload failed')
      console.error(error)
    } finally {
      setUploadingTarget(null)
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const optional = (value: string) => {
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    }

    const keywords = formData.keywords
      .split(',')
      .map((keyword: string) => keyword.trim())
      .filter(Boolean)

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      category: formData.category.trim(),
      author: formData.author.trim(),
      published: formData.published,
      featuredImage: optional(formData.featuredImage),
      images: formData.images.length > 0 ? formData.images : undefined,
      videoUrl: optional(formData.videoUrl),
      metaTitle: optional(formData.metaTitle),
      metaDescription: optional(formData.metaDescription),
      keywords: keywords.length > 0 ? keywords : undefined,
      faqSchema: optional(formData.faqSchema),
      customSchema: optional(formData.customSchema),
    }

    try {
      if (initialData?._id) {
        await updatePost({ id: initialData._id, ...payload })
        toast.success('Post updated')
      } else {
        await createPost(payload)
        toast.success('Post created')
      }
      onSuccess()
    } catch (error) {
      toast.error('Failed to save post')
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 border-white/10 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-muted hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {initialData ? 'Edit Blog Post' : 'Create New Post'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neon">Content</h3>
              <div className="space-y-2">
                <label className="text-sm text-muted">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">Author</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
            </div>

            {/* Media & Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neon">Media & Status</h3>
              <div className="space-y-2">
                <label className="text-sm text-muted">Featured Image</label>
                <div 
                  onClick={() => featuredFileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neon/30 transition-colors"
                >
                  {uploadingTarget === 'featured' ? (
                    <div className="w-6 h-6 border-2 border-neon/20 border-t-neon rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted" />
                      <span className="text-xs text-muted">Click to upload image</span>
                    </>
                  )}
                  {formData.featuredImage && uploadingTarget !== 'featured' && (
                    <span className="text-[10px] text-neon truncate max-w-full">ID: {formData.featuredImage}</span>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={featuredFileInputRef} 
                  onChange={handleFeaturedUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">Gallery Images</label>
                <div
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neon/30 transition-colors"
                >
                  {uploadingTarget === 'gallery' ? (
                    <div className="w-5 h-5 border-2 border-neon/20 border-t-neon rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-muted" />
                      <span className="text-xs text-muted">Upload additional images</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={galleryFileInputRef}
                  onChange={handleGalleryUpload}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                {formData.images.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {formData.images.map((imageId, index) => (
                      <div
                        key={`${imageId}-${index}`}
                        className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2"
                      >
                        <span className="text-[10px] text-neon truncate pr-3">ID: {imageId}</span>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="text-muted hover:text-red-400 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">Video URL (Optional)</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${formData.published ? 'bg-neon' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform ${formData.published ? 'translate-x-6' : ''}`} />
                </button>
                <span className="text-sm font-medium">Published</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neon">Body Content</h3>
            <div className="space-y-2">
              <label className="text-sm text-muted">Excerpt (Short Summary)</label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted">Content (Markdown supported)</label>
              <textarea
                rows={10}
                required
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neon">Advanced SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-muted">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-muted">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">FAQ Schema (JSON string)</label>
                <textarea
                  rows={4}
                  value={formData.faqSchema}
                  onChange={e => setFormData({ ...formData, faqSchema: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted">Custom Schema (JSON string)</label>
                <textarea
                  rows={4}
                  value={formData.customSchema}
                  onChange={e => setFormData({ ...formData, customSchema: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:border-neon/50 outline-none font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-neon text-white font-semibold rounded-lg hover:bg-neon/90 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Post
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
