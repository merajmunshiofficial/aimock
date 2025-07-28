import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useInterview } from '../../interview/hooks/useInterview';
import { getInterviewSession } from '../../services/progress.service';
import { LoadingSpinner } from '../Common/LoadingSpinner';

interface EvaluationSkill {
  name: string;
  score: number;
}

interface EvaluationFeedbackItem {
  question: string;
  userAnswer: string;
  aiFeedback: string;
}

interface EvaluationResult {
  overallScore: number;
  questionsAnswered?: number;
  totalTime?: string;
  skills: EvaluationSkill[];
  keyTakeaways: string[];
  feedback: EvaluationFeedbackItem[];
}

export const InterviewResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { evaluationResult } = useInterview();

  const [results, setResults] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch on mount
  useEffect(() => {
    const fetchResults = async () => {
      // prefer context if present (immediately after interview)
      if (evaluationResult) {
        setResults(evaluationResult as EvaluationResult);
        setLoading(false);
        return;
      }

      if (user?.sub && sessionId) {
        const doc = await getInterviewSession(user.sub, sessionId);
        if (doc?.evaluation) {
          setResults(doc.evaluation as EvaluationResult);
        }
      }
      setLoading(false);
    };
    fetchResults();
  }, [evaluationResult, user, sessionId]);

  const handleNewInterview = () => navigate('/interview/setup');
  const handleStudyMaterials = () => navigate('/study');
  const handleDownloadReport = () => alert('Report download started!');

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading results..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">📊 Interview Results</h1>
              <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
            </div>

            <div className="space-y-8">
              {/* Overall Score */}
              <div className="card bg-base-200">
                <div className="card-body text-center">
                  <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                  <div
                    className="radial-progress text-primary"
                    style={{
                      // @ts-ignore -- DaisyUI custom CSS vars
                      '--value': results.overallScore,
                      '--size': '12rem',
                      '--thickness': '1rem'
                    }}
                  >
                    <span className="text-4xl font-bold">{results.overallScore}%</span>
                  </div>
                  {results.questionsAnswered && (
                    <p className="text-base-content/60 mt-4">Answered {results.questionsAnswered} questions</p>
                  )}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-base-200">
                  <div className="card-body text-center">
                    <div className="text-3xl font-bold text-primary">{results.questionsAnswered ?? '-'}</div>
                    <div className="text-base-content/60">Questions Answered</div>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body text-center">
                    <div className="text-3xl font-bold text-primary">{results.totalTime ?? '-'}</div>
                    <div className="text-base-content/60">Total Time</div>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body text-center">
                    <div className="text-3xl font-bold text-primary">{results.overallScore}%</div>
                    <div className="text-base-content/60">Overall Score</div>
                  </div>
                </div>
              </div>

              {/* Skills Assessment */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Skills Assessment</h2>
                  <div className="space-y-4">
                    {results.skills.map((skill: EvaluationSkill, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-base-content/60">{skill.score}%</span>
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
                    {results.keyTakeaways.map((takeaway: string, index: number) => (
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
                    {results.feedback.map((item: EvaluationFeedbackItem, index: number) => (
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
                  Download Report
                </button>
                <button className="btn btn-secondary" onClick={handleNewInterview}>
                  New Interview
                </button>
                <button className="btn btn-outline" onClick={handleStudyMaterials}>
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
