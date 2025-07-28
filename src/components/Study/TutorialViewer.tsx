import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { readTutorial } from '../../interview/utils/tutorialReader';

export const TutorialViewer: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const [tutorialContent, setTutorialContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadTutorial = async () => {
      if (!topic) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const content = await readTutorial(topic);
        if (content) {
          setTutorialContent(content);
        } else {
          setError('Tutorial not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tutorial');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTutorial();
  }, [topic]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Loading tutorial...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl max-w-md w-full mx-4">
          <div className="card-body text-center">
            <div className="text-error text-5xl mb-4">⚠️</div>
            <h2 className="card-title text-2xl justify-center">Error</h2>
            <p className="text-base-content/80 mb-6">{error}</p>
            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={() => navigate('/study')}>Back to Study</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">📘 {topic ? topic.replace(/-/g, ' ') : 'Tutorial'}</h1>
              <Link to="/study" className="btn btn-secondary">
                Back to Study
              </Link>
            </div>
            
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {tutorialContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
