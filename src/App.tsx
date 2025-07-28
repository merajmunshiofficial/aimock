import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0, Auth0Provider } from '@auth0/auth0-react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { LoadingSpinner } from './components/Common/LoadingSpinner';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { LoginPage } from './components/Auth/LoginPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { InterviewSetup } from './components/Interview/InterviewSetup';
import { InterviewSession } from './components/Interview/InterviewSession';
import { InterviewResults } from './components/Interview/InterviewResults';
import { InterviewHistory } from './components/Dashboard/InterviewHistory';
import { StudyMaterials } from './components/Dashboard/StudyMaterials';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { RecordingManager } from './components/Recording/RecordingManager';
import { NotFound } from './components/Common/NotFound';
import { TutorialViewer } from './components/Study/TutorialViewer';
import { QuestionViewer } from './components/Study/QuestionViewer';

// Main App Content Component
const AppContent: React.FC = () => {
  const { isLoading: isAuth0Loading, error, isAuthenticated, user } = useAuth0();
  const { state, actions } = useAppContext();

  // Set user in context when Auth0 user changes
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const mappedUser = {
        id: user.sub!,
        email: user.email!,
        name: user.name || user.nickname || 'User',
        picture: user.picture,
        createdAt: new Date(user.created_at || Date.now()),
        lastLoginAt: new Date(user.updated_at || Date.now())
      };
      actions.setUser(mappedUser);
    } else {
      actions.setUser(null);
    }
  }, [isAuthenticated, user, actions]);

  // Remove old CRA static fallback if present
  React.useEffect(() => {
    const el = document.getElementById('loading-fallback');
    if (el) el.remove();
  }, []);

  // Handle initial app loading screen




  // Show error if Auth0 has an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="min-h-screen bg-white">


        {/* Global Error Display */}
        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg fixed top-4 right-4 z-50 max-w-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{state.error}</span>
            </div>
            <div className="flex-none">
              <button 
                className="text-red-700 hover:text-red-900 ml-2"
                onClick={actions.clearError}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Offline Indicator */}
        {!state.isOnline && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg fixed bottom-4 left-4 z-50 max-w-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>You're offline</span>
            </div>
          </div>
        )}

        {/* Test Component for Tailwind and DaisyUI */}
        <div className="p-4">
          <p className="text-red-500">If you see red text, Tailwind is working.</p>
          <button className="btn btn-primary">If this is styled like a DaisyUI button, DaisyUI is working.</button>
        </div>

        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard Routes */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="study" element={<StudyMaterials />} />
            <Route path="study/tutorial/:topic" element={<TutorialViewer />} />
            <Route path="study/questions/:topic" element={<QuestionViewer />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="recordings" element={<RecordingManager />} />
            <Route path="history" element={<InterviewHistory />} />
            
            {/* Interview Routes */}
            <Route path="interview">
              <Route path="setup" element={<InterviewSetup />} />
              <Route path="session/:sessionId" element={<InterviewSession />} />
              <Route path="results/:sessionId" element={<InterviewResults />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN || 'your-domain.auth0.com';
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || 'your-client-id';
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin + (process.env.PUBLIC_URL || ''),
          audience: audience,
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <AppProvider>
          <AppContent />
        </AppProvider>
      </Auth0Provider>
    </ErrorBoundary>
  );
};

export default App;
