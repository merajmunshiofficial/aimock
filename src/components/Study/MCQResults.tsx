import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface MCQResult {
  question: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
  isCorrect: boolean;
}

// Mock data - in a real implementation, this would come from the test session
const mockResults: MCQResult[] = [
  {
    question: 'What is the correct way to declare a variable that cannot be reassigned?',
    options: [
      'var myVar = 10;',
      'let myVar = 10;',
      'const myVar = 10;',
      'immutable myVar = 10;'
    ],
    userAnswer: 2,
    correctAnswer: 2,
    explanation: 'The \'const\' keyword declares variables that cannot be reassigned.',
    isCorrect: true
  },
  {
    question: 'Which of the following is NOT a valid JavaScript data type?',
    options: [
      'Boolean',
      'Float',
      'String',
      'Undefined'
    ],
    userAnswer: 1,
    correctAnswer: 1,
    explanation: 'JavaScript does not have a specific \'Float\' data type. Numbers in JavaScript are represented as either integers or floating-point numbers, both under the \'Number\' type.',
    isCorrect: true
  }
];

export const MCQResults: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  
  // Calculate score
  const correctAnswers = mockResults.filter(result => result.isCorrect).length;
  const score = Math.round((correctAnswers / mockResults.length) * 100);
  
  const handleRetakeTest = () => {
    navigate(`/study/mcq-test/${topic}`);
  };
  
  const handleBackToStudy = () => {
    navigate('/study');
  };
  
  const currentResult = mockResults[selectedQuestion];
  
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="card-title text-3xl">📊 MCQ Test Results</h1>
                <p className="text-base-content/70">{topic || 'JavaScript Fundamentals'}</p>
              </div>
              <Link to="/study" className="btn btn-secondary">
                Back to Study
              </Link>
            </div>
            
            {/* Overall Score */}
            <div className="card bg-base-200 mb-8">
              <div className="card-body text-center">
                <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                <div className="radial-progress text-primary" style={{ '--value': score, '--size': '12rem', '--thickness': '1rem' } as React.CSSProperties}>
                  <span className="text-4xl font-bold">{score}%</span>
                </div>
                <p className="text-base-content/60 mt-4">
                  {correctAnswers} out of {mockResults.length} questions correct
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Question Navigation */}
              <div className="lg:col-span-1">
                <div className="card bg-base-200 sticky top-4">
                  <div className="card-body">
                    <h2 className="card-title text-xl mb-4">Questions</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {mockResults.map((result, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm w-full justify-start ${index === selectedQuestion ? 'btn-primary' : result.isCorrect ? 'btn-success' : 'btn-error'}`}
                          onClick={() => setSelectedQuestion(index)}
                        >
                          <span className="mr-2">{index + 1}.</span>
                          <span className="truncate">{result.question.substring(0, 30)}...</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Details */}
              <div className="lg:col-span-2">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="card-title text-xl mb-4">
                      Question {selectedQuestion + 1}
                      <div className={`badge ${currentResult.isCorrect ? 'badge-success' : 'badge-error'}`}>
                        {currentResult.isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </h2>
                    
                    <p className="text-lg mb-6">{currentResult.question}</p>
                    
                    <div className="space-y-4 mb-6">
                      {currentResult.options.map((option, index) => (
                        <div 
                          key={index}
                          className={`card ${index === currentResult.userAnswer ? (currentResult.isCorrect ? 'bg-success' : 'bg-error') : index === currentResult.correctAnswer ? 'bg-success/20' : 'bg-base-300'}`}
                        >
                          <div className="card-body py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-base-100 flex items-center justify-center mr-4">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div>{option}</div>
                              {index === currentResult.correctAnswer && (
                                <div className="ml-auto badge badge-success">Correct Answer</div>
                              )}
                              {index === currentResult.userAnswer && !currentResult.isCorrect && (
                                <div className="ml-auto badge badge-error">Your Answer</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="card bg-base-300">
                      <div className="card-body">
                        <h3 className="font-bold mb-2">Explanation:</h3>
                        <p>{currentResult.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <button className="btn btn-primary" onClick={handleRetakeTest}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Retake Test
              </button>
              <button className="btn btn-secondary" onClick={handleBackToStudy}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Back to Study
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
