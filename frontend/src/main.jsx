import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1>⚠️ Something went wrong</h1>
          <p>The app encountered an error and couldn't load properly.</p>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                margin: '5px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
            <a 
              href="?clear-cache=1"
              style={{
                padding: '10px 20px',
                margin: '5px',
                backgroundColor: '#dc2626',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                display: 'inline-block'
              }}
            >
              Clear Cache & Reload
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hide loading fallback when React app starts
const hideFallback = () => {
  console.log('Hiding loading fallback - React app loaded');
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.display = 'none';
  }
};

try {
  console.log('Starting React app...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log('React app rendered successfully');
  // Hide loading screen after React renders
  setTimeout(hideFallback, 100);
  
} catch (error) {
  console.error('Failed to start React app:', error);
  
  // Show error in the loading fallback
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.querySelector('.loading-text').textContent = 'App Failed to Load';
    fallback.querySelector('.loading-subtext').textContent = `Error: ${error.message}`;
    fallback.querySelector('#error-actions').style.display = 'block';
  }
}
