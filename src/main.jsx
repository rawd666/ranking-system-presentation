import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/hedvig-letters-serif'
import './styles.css'
import App from './App.jsx'

// Always open on the cover, not wherever the last visit or a #section left off.
history.scrollRestoration = 'manual'
history.replaceState(null, '', location.pathname + location.search)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
