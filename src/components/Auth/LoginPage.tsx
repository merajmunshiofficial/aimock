import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingSpinner } from '../Common/LoadingSpinner';

export const LoginPage: React.FC = () => {
  const { loginWithRedirect, isLoading, error } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <LoadingSpinner size="lg" text="Initializing..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-md w-full mx-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-base-content">AI Mock Interview</h1>
            <p className="text-base-content/70 mt-2">
              Practice interviews with AI-powered feedback
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-primary text-xl">🤖</div>
              <span className="text-sm text-base-content/80">AI-powered interview questions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-primary text-xl">🎥</div>
              <span className="text-sm text-base-content/80">Video & audio recording</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-primary text-xl">📊</div>
              <span className="text-sm text-base-content/80">Detailed performance analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-primary text-xl">🎤</div>
              <span className="text-sm text-base-content/80">Speech-to-text & voice interaction</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error.message}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="btn btn-primary w-full text-lg h-12"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Signing In...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In to Continue
              </>
            )}
          </button>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-base-content/60">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Demo Features */}
          <div className="mt-8 pt-6 border-t border-base-300">
            <h3 className="text-sm font-semibold text-base-content mb-3">What you'll get:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-base-content/70">
              <div>✓ Unlimited interviews</div>
              <div>✓ Multiple tech stacks</div>
              <div>✓ Performance tracking</div>
              <div>✓ Study materials</div>
              <div>✓ Recording downloads</div>
              <div>✓ AI feedback</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-base-content/50">
          <p>Secure authentication powered by Auth0</p>
        </div>
      </div>
    </div>
  );
};
