import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { readQuestions } from '../../interview/utils/questionReader';

interface Question {
  question: string;
  answer: string;
}

export const QuestionViewer: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadQuestions = async () => {
      if (!topic) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const questionData = await readQuestions(topic);
        if (questionData && questionData.length > 0) {
          setQuestions(questionData);
        } else {
          setError('No questions found for this topic');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [topic]);
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
    }
  };
  
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Loading questions...</p>
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
  
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No questions found for this topic.</p>
          <Link to="/study" className="btn btn-primary mt-4">Back to Study</Link>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="card-title text-3xl">❓ Practice Questions</h1>
                <p className="text-base-content/70">{topic?.replace(/-/g, ' ') || 'Topic'} - Question {currentQuestionIndex + 1} of {questions.length}</p>
              </div>
              <Link to="/study" className="btn btn-secondary">
                Back to Study
              </Link>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-base-300 rounded-full h-2.5 mb-6">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="space-y-8">
              {/* Question */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">Question {currentQuestionIndex + 1}</h2>
                  <p className="text-lg">{currentQuestion.question}</p>
                </div>
              </div>
              
              {/* Answer */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-xl">Answer</h2>
                    <button 
                      className="btn btn-outline"
                      onClick={toggleAnswer}
                    >
                      {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </button>
                  </div>
                  
                  {showAnswer && (
                    <div className="prose max-w-none bg-base-100 p-4 rounded-lg">
                      <p>{currentQuestion.answer}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <button 
                  className="btn btn-outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Previous
                </button>
                
                <button 
                  className="btn btn-primary"
                  onClick={toggleAnswer}
                >
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                
                <button 
                  className="btn btn-outline"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next →
                </button>
              </div>
              
              {/* Question Navigation */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="font-bold mb-3">Questions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${index === currentQuestionIndex ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setShowAnswer(false);
                        }}
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
