import { Component, ErrorInfo, ReactNode } from 'react'
import Button from './shared/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-pf-bg p-6">
          <div className="max-w-2xl w-full bg-pf-bg-card border border-pf-border rounded-lg p-8 shadow-glow">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-red-500 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-pf-text-muted">
                The application encountered an unexpected error.
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-pf-bg-dark rounded-lg border border-pf-border">
                <h2 className="text-lg font-semibold text-pf-accent mb-2">
                  Error Details:
                </h2>
                <p className="text-sm text-pf-text font-mono mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-pf-text-muted">
                    <summary className="cursor-pointer hover:text-pf-accent">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="primary">
                Return to Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Reload Page
              </Button>
            </div>

            <p className="text-sm text-center text-pf-text-muted mt-6">
              If this problem persists, please report it on GitHub.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
