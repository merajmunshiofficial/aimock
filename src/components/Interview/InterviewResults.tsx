import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export const InterviewResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  // Mock results data - in a real app this would come from context or API
  const [results] = useState({
    overallScore: 85,
    questionsAnswered: 10,
    totalTime: '15:30',
    skills: [
      { name: 'JavaScript', score: 90 },
      { name: 'React', score: 80 },
      { name: 'Problem Solving', score: 75 },
      { name: 'Communication', score: 85 },
    ],
    keyTakeaways: [
      'Strong understanding of core JavaScript concepts',
      'Good problem-solving approach',
      'Could improve on explaining technical decisions',
      'Demonstrated good coding practices',
    ],
    feedback: [
      {
        question: 'Explain the concept of closures in JavaScript',
        userAnswer: 'A closure is a function that has access to variables from its outer scope even after the outer function has returned.',
        aiFeedback: 'Good explanation. You correctly identified that closures allow inner functions to access outer scope variables. Consider mentioning practical use cases like data encapsulation.',
      },
      {
        question: 'How do you optimize React component performance?',
        userAnswer: 'Use React.memo for functional components, useMemo for expensive calculations, and useCallback for functions passed as props.',
        aiFeedback: 'Excellent answer covering the main optimization techniques. You might also mention lazy loading with React.lazy and Suspense.',
      },
    ],
  });
  
  const handleNewInterview = () => {
    navigate('/interview/setup');
  };
  
  const handleStudyMaterials = () => {
    navigate('/study');
  };
  
  const handleDownloadReport = () => {
    // Mock download functionality
    alert('Report download started!');
  };
  
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">📊 Interview Results</h1>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
            
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="card bg-base-200">
                <div className="card-body text-center">
                  <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                  <div className="radial-progress text-primary" style={{ '--value': results.overallScore, '--size': '12rem', '--thickness': '1rem' } as React.CSSProperties}>
                    <span className="text-4xl font-bold">{results.overallScore}%</span>
                  </div>
                  <p className="text-base-content/60 mt-4">Session ID: {sessionId || 'new'}</p>
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-base-200">
                  <div className="card-body text-center">
                    <div className="text-3xl font-bold text-primary">{results.questionsAnswered}</div>
                    <div className="text-base-content/60">Questions Answered</div>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body text-center">
                    <div className="text-3xl font-bold text-primary">{results.totalTime}</div>
                    <div className="text-base-content/60">Total Time</div>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body text-center">
                    <div className="text-3xl font-bold text-primary">{results.skills.length}</div>
                    <div className="text-base-content/60">Skills Assessed</div>
                  </div>
                </div>
              </div>
              
              {/* Skills Assessment */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Skills Assessment</h2>
                  <div className="space-y-4">
                    {results.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span className="font-medium">{skill.score}%</span>
                        </div>
                        <div className="w-full bg-base-300 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${skill.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Key Takeaways */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Key Takeaways</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {results.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="text-base-content/80">{takeaway}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Detailed Feedback */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Detailed Feedback</h2>
                  <div className="space-y-6">
                    {results.feedback.map((item, index) => (
                      <div key={index} className="space-y-3">
                        <div className="font-bold">Question {index + 1}: {item.question}</div>
                        <div className="card bg-base-300">
                          <div className="card-body p-4">
                            <div className="font-medium mb-1">Your Answer:</div>
                            <p>{item.userAnswer}</p>
                          </div>
                        </div>
                        <div className="card bg-base-300">
                          <div className="card-body p-4">
                            <div className="font-medium mb-1">AI Feedback:</div>
                            <p>{item.aiFeedback}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button className="btn btn-primary" onClick={handleDownloadReport}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Report
                </button>
                <button className="btn btn-secondary" onClick={handleNewInterview}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  New Interview
                </button>
                <button className="btn btn-outline" onClick={handleStudyMaterials}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Study Materials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
