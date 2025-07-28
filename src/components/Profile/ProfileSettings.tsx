import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { storeOpenAIApiKey, storePerplexityApiKey, getOpenAIApiKey, getPerplexityApiKey, clearApiKeys } from '../../interview/utils/apiKeyManager';

export const ProfileSettings: React.FC = () => {
  const { logout, user } = useAuth0();
  const navigate = useNavigate();
  
  const [openaiKey, setOpenaiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showPerplexityKey, setShowPerplexityKey] = useState(false);
  
  useEffect(() => {
    // Load existing API keys when component mounts
    setOpenaiKey(getOpenAIApiKey() || '');
    setPerplexityKey(getPerplexityApiKey() || '');
  }, []);
  
  const handleSaveKeys = () => {
    if (openaiKey) {
      storeOpenAIApiKey(openaiKey);
    }
    if (perplexityKey) {
      storePerplexityApiKey(perplexityKey);
    }
    alert('API keys saved successfully!');
  };
  
  const handleClearKeys = () => {
    clearApiKeys();
    setOpenaiKey('');
    setPerplexityKey('');
    alert('API keys cleared successfully!');
  };
  
  const handleLogout = () => {
    // Clear API keys on logout
    clearApiKeys();
    // Logout from Auth0
    logout({ logoutParams: { returnTo: window.location.origin } });
    // Navigate to home
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">⚙️ Profile Settings</h1>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
            
            <div className="space-y-8">
              {/* User Profile Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">User Profile</h2>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    {user?.picture && (
                      <div className="avatar">
                        <div className="w-16 rounded-full">
                          <img src={user.picture} alt={user.name || 'User'} />
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{user?.name || 'User'}</h3>
                      <p className="text-base-content/60">{user?.email || 'No email provided'}</p>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-error w-full max-w-xs"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
              
              {/* API Keys Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">API Keys</h2>
                  <p className="text-base-content/70 mb-6">
                    Enter your API keys for OpenAI and Perplexity to enable AI-powered interview features.
                  </p>
                  
                  <div className="space-y-6">
                    {/* OpenAI API Key */}
                    <div>
                      <label className="label">
                        <span className="label-text font-bold">OpenAI API Key</span>
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type={showOpenaiKey ? 'text' : 'password'}
                          className="input input-bordered flex-1"
                          placeholder="Enter your OpenAI API key"
                          value={openaiKey}
                          onChange={(e) => setOpenaiKey(e.target.value)}
                        />
                        <button 
                          className="btn btn-outline"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        >
                          {showOpenaiKey ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <p className="text-sm text-base-content/60 mt-2">
                        Used for GPT-3.5-turbo model to generate questions and evaluate answers.
                      </p>
                    </div>
                    
                    {/* Perplexity API Key */}
                    <div>
                      <label className="label">
                        <span className="label-text font-bold">Perplexity API Key</span>
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type={showPerplexityKey ? 'text' : 'password'}
                          className="input input-bordered flex-1"
                          placeholder="Enter your Perplexity API key"
                          value={perplexityKey}
                          onChange={(e) => setPerplexityKey(e.target.value)}
                        />
                        <button 
                          className="btn btn-outline"
                          onClick={() => setShowPerplexityKey(!showPerplexityKey)}
                        >
                          {showPerplexityKey ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <p className="text-sm text-base-content/60 mt-2">
                        Used for Llama-3-sonar-small-32k-chat model as an alternative to OpenAI.
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <button 
                        className="btn btn-primary flex-1"
                        onClick={handleSaveKeys}
                      >
                        Save Keys
                      </button>
                      <button 
                        className="btn btn-outline flex-1"
                        onClick={handleClearKeys}
                      >
                        Clear Keys
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security Notice */}
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">Security Notice</h3>
                  <p className="text-sm">
                    Your API keys are stored locally in your browser's localStorage and are never sent to our servers. 
                    They are only used to communicate directly with OpenAI and Perplexity APIs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
