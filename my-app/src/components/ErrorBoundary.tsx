import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div
            style={{
              background: '#FFF',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😢</div>
            <h2 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '1.5rem' }}>
              哎呀，出错了！
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#666', lineHeight: '1.6' }}>
              狗狗好像遇到了一些问题，让我们重新开始吧！
            </p>
            {this.state.error && (
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#666',
                  overflow: 'auto',
                  maxHeight: '150px',
                  marginBottom: '24px',
                  textAlign: 'left',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 32px',
                background: '#667eea',
                color: '#FFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5a6fd6';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              重新开始 🔄
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
