import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './ App'
import './index.css'

// StrictMode renders every component twice in development to catch side-effects.
// It has zero impact on production builds — it's a dev-only safety net.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);