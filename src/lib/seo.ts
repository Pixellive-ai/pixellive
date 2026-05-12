import { useEffect } from 'react'

export function useSEO(title: string, description?: string, keywords?: string[], schema?: string) {
  useEffect(() => {
    document.title = `${title} | Pixel Live Production`
    
    // Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    }

    // Keywords
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords.join(', '))
    }

    // JSON-LD Schema
    let scriptSchema = document.querySelector('script[type="application/ld+json"]#dynamic-schema')
    if (schema) {
      if (!scriptSchema) {
        scriptSchema = document.createElement('script')
        scriptSchema.setAttribute('type', 'application/ld+json')
        scriptSchema.setAttribute('id', 'dynamic-schema')
        document.head.appendChild(scriptSchema)
      }
      scriptSchema.textContent = schema
    } else if (scriptSchema) {
      scriptSchema.remove()
    }
  }, [title, description, keywords, schema])
}
