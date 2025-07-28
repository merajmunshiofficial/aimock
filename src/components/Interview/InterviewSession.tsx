import React, { useState, useEffect, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Timestamp } from 'firebase/firestore';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useInterview } from '../../interview/hooks/useInterview';
import { InterviewRecorder } from './InterviewRecorder';
import { saveInterviewSession } from '../../services/progress.service';

export const InterviewSession: React.FC = () => {
  const [endRequested, setEndRequested] = useState(false);
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth0();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [startedAt] = useState(() => Timestamp.now());
  
  // Get interview configuration from URL parameters
  const searchParamsString = searchParams.toString();
  const topics = useMemo(() => searchParams.get('topics')?.split(',') || [], [searchParamsString]);
  const questionType = useMemo(() => (searchParams.get('type') as 'technical' | 'mcq' | 'behavioral') || 'technical', [searchParamsString]);
  const selectionMode = useMemo(() => (searchParams.get('mode') as 'random' | 'sequential' | 'mixed') || 'sequential', [searchParamsString]);
  const apiProvider = useMemo(() => (searchParams.get('provider') as 'openai' | 'perplexity') || 'openai', [searchParamsString]);
  
  // Initialize interview hook
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    aiResponses,
    isInterviewActive,
    isEvaluating,
    isLoading,
    error,
    startInterview,
    submitAnswer,
    continueInterview,
    evaluateInterviewPerformance,
    evaluationResult,
    currentQuestion
  } = useInterview();
  
  // Handle initialization
  useEffect(() => {
    if (sessionId === 'new' && topics.length > 0 && !isInterviewActive) {
      // Start new interview only if one isn't already active
      const startNewInterview = async () => {
        await startInterview(topics, selectionMode, apiProvider);
      };
      startNewInterview();
    } else if (sessionId !== 'new') {
      // Load existing interview (would need to implement loading from storage)
      console.log('Loading existing interview session:', sessionId);
    }
  }, [sessionId, topics, selectionMode, apiProvider, isInterviewActive, startInterview]);
  
  const handleSubmitAnswer = async () => {
    if (userAnswer.trim()) {
      await submitAnswer(userAnswer);
      setUserAnswer('');
    }
  };
  
  const handleEndInterview = async () => {
    setEndRequested(true);
  
    // If user has answered at least one question, submit the current answer first
    if (userAnswer.trim()) {
      await submitAnswer(userAnswer);
      setUserAnswer('');
    }
  
    // Then evaluate the interview
    await evaluateInterviewPerformance();
  };

  // Persist and navigate after evaluation ready
  useEffect(() => {
    const persistAndNavigate = async () => {
      if (endRequested && !isEvaluating && evaluationResult) {
        const id = sessionId ?? crypto.randomUUID();
        try {
          if (user?.sub) {
            await saveInterviewSession(user.sub, {
              sessionId: id,
              topic: topics.join(', '),
              score: (evaluationResult?.overallScore ?? 0) as number,
              startedAt,
              finishedAt: Timestamp.now(),
              transcript: userAnswers.join('\n'),
              feedback: aiResponses.join('\n'),
              evaluation: evaluationResult
            });
          }
        } catch (err) {
          console.warn('Failed to save session', err);
        }
        navigate(`/interview/results/${id}`);
      }
    };
    persistAndNavigate();
  }, [endRequested, isEvaluating, evaluationResult, user?.sub, sessionId, startedAt, topics, userAnswers, aiResponses, navigate]);  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Preparing your interview...</p>
        </div>
      </div>
    );
  }
  
  // Evaluation state
  if (isEvaluating) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Evaluating your performance...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
          {/* Recorder preview */}
          <div className="mb-8">
            <InterviewRecorder />
          </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">🎤 Interview Session</h1>
              <button 
                onClick={handleEndInterview}
                className="btn btn-secondary"
                disabled={isEvaluating}
              >
                End Interview
              </button>
            </div>
            
            {error && (
              <div className="alert alert-error mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-base-content/60 mb-2">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{questions.length > 0 ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0}% Complete</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            {currentQuestion ? (
              <div className="space-y-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="card-title text-xl">Question</h2>
                    <p className="text-lg">{currentQuestion.question}</p>
                  </div>
                </div>
                
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="card-title text-xl mb-4">Your Answer</h2>
                    <textarea
                      className="textarea textarea-bordered w-full h-32"
                      placeholder="Type your answer here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={isEvaluating}
                    />
                    
                    <div className="flex justify-between mt-4">
                      <button 
                        className="btn btn-outline"
                        onClick={() => setUserAnswer('')}
                        disabled={isEvaluating}
                      >
                        Clear
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={handleSubmitAnswer}
                        disabled={isEvaluating || !userAnswer.trim()}
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </div>
                
                {aiResponses[currentQuestionIndex - 1] && (
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h2 className="card-title text-xl">AI Feedback</h2>
                      <div className="prose max-w-none">
                        <p>{aiResponses[currentQuestionIndex - 1]}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {isEvaluating && (
                  <div className="flex items-center justify-center py-4">
                    <div className="loading loading-spinner loading-md text-primary"></div>
                    <span className="ml-2">AI is thinking...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-4">Interview Complete!</h2>
                <p className="text-base-content/60 mb-6">
                  You've answered all questions. Click below to see your evaluation.
                </p>
                <button 
                  onClick={handleEndInterview}
                  className="btn btn-primary btn-lg"
                  disabled={isEvaluating}
                >
                  View Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
