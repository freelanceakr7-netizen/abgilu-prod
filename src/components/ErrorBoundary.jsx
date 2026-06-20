import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ErrorFallback Component
 * 
 * Displays a user-friendly error UI when an error occurs in the application.
 * Shows different levels of detail based on the environment (development vs production).
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Error} props.error - The error object that occurred
 * @param {React.ReactNode} props.resetErrorBoundary - Function to reset the error boundary
 * @returns {JSX.Element} The error fallback UI
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  const isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Navigate to home page
   */
  const handleGoHome = () => {
    navigate('/');
  };

  /**
   * Reload the current page
   */
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-kora flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-kora rounded-lg shadow-lg border border-indigo/20 p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-serif text-center text-indigo mb-4">
          Oops! Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-center text-gray-600 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred. 
          Please try again or contact support if the problem persists.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="mb-8">
            <details className="bg-gray-50 rounded-lg border border-gray-200">
              <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                Error Details (Development Mode)
              </summary>
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Error Message
                  </p>
                  <p className="text-sm text-red-600 font-mono bg-red-50 p-2 rounded">
                    {error.message}
                  </p>
                </div>
                {error.stack && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Stack Trace
                    </p>
                    <pre className="text-xs text-gray-700 bg-gray-100 p-3 rounded overflow-x-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleTryAgain}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-kora text-indigo border-2 border-indigo rounded-lg hover:bg-indigo/10 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* Support Information */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our{' '}
            <a href="/contact" className="text-indigo hover:text-terracotta transition-colors font-medium">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error),
  resetErrorBoundary: PropTypes.func.isRequired
};

ErrorFallback.defaultProps = {
  error: null
};

/**
 * ErrorBoundary Component
 * 
 * A React error boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire application.
 * 
 * @component
 * @example
 * ```jsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 * 
 * @see {@link https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary}
 */
class ErrorBoundary extends React.Component {
  /**
   * Creates an instance of ErrorBoundary
   * @param {Object} props - Component props
   */
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Updates state when an error is thrown during rendering
   * 
   * @static
   * @param {Error} error - The error that was thrown
   * @returns {Object} Updated state object
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Lifecycle method called when an error is caught
   * Logs the error to the console and to an error logging service
   * 
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} errorInfo - Information about the component stack
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log error details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // TODO: Integrate with error logging service in Task 2
    // This placeholder will be replaced with actual error logging
    // Example: logErrorToService(errorDetails);
    console.log('Error details ready for logging service:', errorDetails);

    // Store error info in state for potential use in ErrorFallback
    this.setState({
      errorInfo
    });

    // Optional: Send to external error tracking service
    // This will be implemented in Task 2 with Sentry or Firebase Crashlytics
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        extra: errorDetails
      });
    }
  }

  /**
   * Resets the error boundary state, allowing the component tree to be re-rendered
   * 
   * @public
   */
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Renders the component tree or fallback UI
   * 
   * @returns {JSX.Element} Either children or ErrorFallback component
   */
  render() {
    // If an error occurred, show the fallback UI
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    // Otherwise, render children normally
    // Handle null/undefined children gracefully
    if (this.props.children === null || this.props.children === undefined) {
      console.warn('ErrorBoundary received null/undefined children');
      return null;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /**
   * Child components to be wrapped by the error boundary
   */
  children: PropTypes.node
};

ErrorBoundary.defaultProps = {
  children: null
};

export default ErrorBoundary;
