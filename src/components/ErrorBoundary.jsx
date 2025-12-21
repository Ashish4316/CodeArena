import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // you can log to an external service here
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">An unexpected error occurred. Try reloading the page or go back to safety.</p>
          <div className="space-x-2">
            <button onClick={() => window.location.reload()} className="px-3 py-2 bg-blue-600 text-white rounded">Reload</button>
            <Link to="/" className="px-3 py-2 bg-gray-200 rounded">Home</Link>
          </div>
          <details className="mt-4 text-sm text-gray-600">
            <summary>Technical details</summary>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
