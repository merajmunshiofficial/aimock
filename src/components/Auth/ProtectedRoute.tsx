import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingSpinner } from '../Common/LoadingSpinner';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  // Local timeout to avoid indefinite spinner if Auth0 gets stuck
  const [showSpinner, setShowSpinner] = React.useState(true);
  React.useEffect(() => {
    if (!isLoading) {
      setShowSpinner(false);
      return;
    }
    const t = setTimeout(() => setShowSpinner(false), 6000);
    return () => clearTimeout(t);
  }, [isLoading]);

  // Show spinner overlay but do not block route rendering
  const loadingOverlay = isLoading && showSpinner ? (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
      <LoadingSpinner size="lg" text="Checking authentication..." />
    </div>
  ) : null;

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {loadingOverlay}
      <Outlet />
    </>
  );
};
