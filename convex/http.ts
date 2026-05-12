import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { api } from './_generated/api'

const http = httpRouter()

http.route({
  path: '/robots.txt',
  method: 'GET',
  handler: httpAction(async (ctx) => {
    const robotsTxt = await ctx.runQuery(api.seo.get, { key: 'robots.txt' })
    const content = robotsTxt || 'User-agent: *\nAllow: /'
    
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }),
})

export default http
