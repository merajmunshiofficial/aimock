import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMCQTest } from '../../interview/hooks/useMCQTest';

export const MCQTest: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const {
    testSession,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    error,
    isTestComplete,
    startTest,
    submitAnswer,
    goToQuestion,
    evaluateTest,
    resetTest
  } = useMCQTest();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  useEffect(() => {
    if (topic) {
      startTest(topic, 10, 'random');
    }
  }, [topic]);
  
  useEffect(() => {
    // Reset selected option when question changes
    setSelectedOption(null);
  }, [currentQuestionIndex]);
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  const handleAnswerSubmit = () => {
    if (selectedOption !== null && testSession) {
      submitAnswer(selectedOption);
    }
  };
  
  const handleEvaluateTest = () => {
    evaluateTest();
    navigate(`/study/mcq-results/${topic}`);
  };
  
  const handleResetTest = () => {
    resetTest();
    setSelectedOption(null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Loading MCQ test...</p>
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
              <button className="btn btn-secondary" onClick={handleResetTest}>Try Again</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!testSession) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No test session found.</p>
          <Link to="/study" className="btn btn-primary mt-4">Back to Study</Link>
        </div>
      </div>
    );
  }
  
  if (testSession.endTime && testSession.score !== null) {
    // Test has been evaluated, redirect to results
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Test completed. Redirecting to results...</p>
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
              <div>
                <h1 className="card-title text-3xl">📝 MCQ Test</h1>
                <p className="text-base-content/70">{testSession.topic} - Question {currentQuestionIndex + 1} of {testSession.questions.length}</p>
              </div>
              <Link to="/study" className="btn btn-secondary">
                Back to Study
              </Link>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-base-300 rounded-full h-2.5 mb-6">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${((currentQuestionIndex + 1) / testSession.questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="space-y-8">
              {/* Question */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">Question {currentQuestionIndex + 1}</h2>
                  <p className="text-lg">{currentQuestion?.question}</p>
                </div>
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`card cursor-pointer transition-all duration-200 ${selectedOption === index ? 'bg-primary text-primary-content' : 'bg-base-200 hover:bg-base-300'}`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="card-body py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-base-100 flex items-center justify-center mr-4">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div>{option}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation and Controls */}
              <div className="flex flex-wrap justify-between gap-4 pt-4">
                <div className="flex gap-2">
                  <button 
                    className="btn btn-outline"
                    onClick={() => goToQuestion(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    ← Previous
                  </button>
                  
                  <button 
                    className="btn btn-outline"
                    onClick={() => goToQuestion(Math.min(testSession.questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === testSession.questions.length - 1}
                  >
                    Next →
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={handleAnswerSubmit}
                    disabled={selectedOption === null}
                  >
                    {currentQuestionIndex === testSession.questions.length - 1 ? 'Finish Test' : 'Submit Answer'}
                  </button>
                  
                  {isTestComplete && (
                    <button 
                      className="btn btn-secondary"
                      onClick={handleEvaluateTest}
                    >
                      Evaluate Test
                    </button>
                  )}
                </div>
              </div>
              
              {/* Question Navigation */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="font-bold mb-3">Questions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {testSession.questions.map((_, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${index === currentQuestionIndex ? 'btn-primary' : testSession.userAnswers[index] !== -1 ? 'btn-success' : 'btn-outline'}`}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
