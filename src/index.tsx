import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Boot logs
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
console.info('[APP] boot start', { 
  env: import.meta.env.MODE,
  supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'MISSING'
});
window.addEventListener('error', e => console.error('[WINDOW ERROR]', e));
window.addEventListener('unhandledrejection', e => console.error('[UNHANDLED REJECTION]', e));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>  {/* Temporarily disabled to prevent double-mounting during dev */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  // </React.StrictMode>
);
