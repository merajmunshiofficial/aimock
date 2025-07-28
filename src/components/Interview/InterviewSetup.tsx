import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestionTopics } from '../../interview/utils/questionReader';
import { hasApiKeys } from '../../interview/utils/apiKeyManager';

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionType, setQuestionType] = useState<'technical' | 'mcq' | 'behavioral'>('technical');
  const [selectionMode, setSelectionMode] = useState<'random' | 'sequential' | 'mixed'>('sequential');
  const [apiProvider, setApiProvider] = useState<'openai' | 'perplexity'>('openai');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [error, setError] = useState<string>('');
  
  const topics = getQuestionTopics();
  
  const handleTopicChange = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  const handleStartInterview = () => {
    // Validate selections
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic');
      return;
    }
    
    if (questionCount < 1 || questionCount > 50) {
      setError('Question count must be between 1 and 50');
      return;
    }
    
    // Check if API keys are available
    if (!hasApiKeys()) {
      setError('Please set your API keys in the profile settings before starting an interview');
      return;
    }
    
    // Navigate to interview session with parameters
    const params = new URLSearchParams({
      topics: selectedTopics.join(','),
      type: questionType,
      mode: selectionMode,
      provider: apiProvider,
      count: questionCount.toString()
    });
    
    navigate(`/interview/session/new?${params.toString()}`);
  };
  
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">🎯 Interview Setup</h1>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
            
            <p className="text-base-content/70 mb-8">
              Configure your interview preferences and get ready to start your AI-powered mock interview.
            </p>
            
            {error && (
              <div className="alert alert-error mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-8">
              {/* Topic Selection */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">📚 Select Topics</h2>
                  <p className="text-base-content/70 mb-4">Choose the topics you want to be interviewed on:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {topics.map((topic, index) => (
                      <div 
                        key={index} 
                        className={`card cursor-pointer transition-all ${selectedTopics.includes(topic) ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                        onClick={() => handleTopicChange(topic)}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center">
                            <div className="flex-1 font-medium">
                              {topic.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            {selectedTopics.includes(topic) && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Question Type */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">❓ Question Type</h2>
                  <p className="text-base-content/70 mb-4">Select the type of questions for your interview:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`card cursor-pointer transition-all ${questionType === 'technical' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setQuestionType('technical')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">Technical</h3>
                        <p className="text-sm">In-depth technical questions</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`card cursor-pointer transition-all ${questionType === 'mcq' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setQuestionType('mcq')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">MCQ</h3>
                        <p className="text-sm">Multiple choice questions</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`card cursor-pointer transition-all ${questionType === 'behavioral' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setQuestionType('behavioral')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">Behavioral</h3>
                        <p className="text-sm">Behavioral and situational questions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Selection Mode */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">🔀 Selection Mode</h2>
                  <p className="text-base-content/70 mb-4">Choose how questions are selected:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`card cursor-pointer transition-all ${selectionMode === 'random' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setSelectionMode('random')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">Random</h3>
                        <p className="text-sm">Randomly selected questions</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`card cursor-pointer transition-all ${selectionMode === 'sequential' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setSelectionMode('sequential')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">Sequential</h3>
                        <p className="text-sm">Questions in order</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`card cursor-pointer transition-all ${selectionMode === 'mixed' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setSelectionMode('mixed')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">Mixed</h3>
                        <p className="text-sm">Mix of topics and selection methods</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* API Provider */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">🤖 AI Provider</h2>
                  <p className="text-base-content/70 mb-4">Select which AI provider to use for your interview:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`card cursor-pointer transition-all ${apiProvider === 'openai' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setApiProvider('openai')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">OpenAI</h3>
                        <p className="text-sm">Powered by GPT models</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`card cursor-pointer transition-all ${apiProvider === 'perplexity' ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                      onClick={() => setApiProvider('perplexity')}
                    >
                      <div className="card-body p-4">
                        <h3 className="font-bold text-lg">Perplexity</h3>
                        <p className="text-sm">Powered by Llama models</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Count */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">🔢 Question Count</h2>
                  <p className="text-base-content/70 mb-4">Number of questions in your interview:</p>
                  
                  <div className="flex items-center space-x-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={questionCount} 
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="range range-primary" 
                    />
                    <span className="text-2xl font-bold w-12">{questionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-base-content/60">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>
              </div>
              
              {/* Start Button */}
              <div className="text-center">
                <button 
                  onClick={handleStartInterview}
                  className="btn btn-primary btn-lg"
                >
                  Start Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
