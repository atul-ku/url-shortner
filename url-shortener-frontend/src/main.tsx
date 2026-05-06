import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './ App'

// StrictMode renders every component twice in development to catch side-effects.
// It has zero impact on production builds — it's a dev-only safety net.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)