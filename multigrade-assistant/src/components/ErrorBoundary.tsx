import { Component, type ErrorInfo, type ReactNode } from 'react';
import { db } from '../db/db';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = async () => {
    if (window.confirm('Resetting will clear locally cached records. Are you sure?')) {
      try {
        await db.delete();
        localStorage.clear();
      } catch (err) {
        console.error('Error clearing database:', err);
      }
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, maxWidth: 600, margin: '40px auto', textAlign: 'center', background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#b3402a' }}>⚠️ Something went wrong / कुछ गलत हो गया</h2>
          <p style={{ color: '#555', lineHeight: 1.6 }}>
            The application encountered an unexpected error. You can reload the page or reset local storage if data is corrupted.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
            <button type="button" className="primary" onClick={() => window.location.reload()} style={{ minHeight: 42, minWidth: 120 }}>
              Reload / पुनः लोड करें
            </button>
            <button type="button" onClick={this.handleReset} style={{ minHeight: 42, color: '#b3402a', borderColor: '#b3402a' }}>
              Reset Local Data / डेटा रीसेट करें
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
