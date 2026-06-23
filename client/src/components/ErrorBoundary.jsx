import { Component } from "react";
import { motion } from "framer-motion";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        >
          <div className="glass-card max-w-md w-full p-8 space-y-6 text-center">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-100">Oops! Something went wrong</h1>
            <p className="text-slate-400 text-sm">
              We encountered an unexpected error. Try refreshing the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-left space-y-2 max-h-32 overflow-y-auto">
                <p className="text-xs font-mono text-red-400">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <p className="text-xs font-mono text-slate-400">{this.state.errorInfo.componentStack}</p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
