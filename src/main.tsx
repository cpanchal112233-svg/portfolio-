import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <main style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui', background: '#07111b', color: '#f8fbff' }}>
          <h1>Chintan Panchal</h1>
          <p>Software Engineer · MSc Computer Science · AWS Certified Cloud Practitioner</p>
          <p>
            <a href="mailto:chintanpanchal63@gmail.com" style={{ color: '#9ec5e8' }}>
              chintanpanchal63@gmail.com
            </a>
            {' · '}
            <a href="https://github.com/cpanchal112233-svg" style={{ color: '#9ec5e8' }}>
              GitHub
            </a>
            {' · '}
            <a href="https://www.linkedin.com/in/uncodeworld-chintan" style={{ color: '#9ec5e8' }}>
              LinkedIn
            </a>
          </p>
          <p>Refresh the page if the interactive tour did not load.</p>
        </main>
      }
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
