import React from 'react';
import { Link } from 'react-router-dom';

export const ProfileSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6">⚙️ Profile Settings</h1>
            <p className="text-base-content/70 mb-8">
              Manage your profile, preferences, and interview settings.
            </p>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-base-content/60 mb-6">
                Profile settings functionality is being developed.
              </p>
              <Link to="/dashboard" className="btn btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
