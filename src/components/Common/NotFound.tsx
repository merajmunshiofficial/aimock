import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold text-base-content mb-4">Page Not Found</h1>
        <p className="text-base-content/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <Link to="/dashboard" className="btn btn-ghost">
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-8 text-sm text-base-content/60">
          <p>If you think this is a mistake, please contact support.</p>
        </div>
      </div>
    </div>
  );
};
