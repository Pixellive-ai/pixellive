import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import App from './App'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL as string

const convex = convexUrl
  ? new ConvexReactClient(convexUrl)
  : null

function Root() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  convex ? (
    <ConvexProvider client={convex}>
      <Root />
    </ConvexProvider>
  ) : (
    <Root />
  )
)
