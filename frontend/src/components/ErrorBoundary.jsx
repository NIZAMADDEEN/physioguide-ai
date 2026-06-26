import React from "react";
import Card from "./common/Card";
import Button from "./common/Button";

/**
 * Error boundary component to catch React rendering errors.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-background p-4">
          <Card elevation={2} className="max-w-md text-center">
            <span
              className="material-symbols-outlined text-error mb-3"
              style={{ fontSize: 48 }}
            >
              error
            </span>
            <h2 className="text-headline-md mb-2">Something went wrong</h2>
            <p className="text-body-md text-on-surface-variant mb-4">
              We encountered an unexpected error while loading this page.
            </p>
            {this.state.error && (
              <pre className="text-start bg-surface-container p-3 rounded mb-4 overflow-auto text-label-sm text-error">
                {this.state.error.message}
              </pre>
            )}
            <Button onClick={this.handleReset} icon="refresh">
              Try Again
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
