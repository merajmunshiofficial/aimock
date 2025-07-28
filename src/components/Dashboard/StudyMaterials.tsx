import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTutorialTopics } from '../../interview/utils/tutorialReader';
import { getQuestionTopics } from '../../interview/utils/questionReader';

export const StudyMaterials: React.FC = () => {
  const navigate = useNavigate();
  const tutorialTopics = getTutorialTopics();
  const questionTopics = getQuestionTopics();

  const handleViewTutorial = (topic: string) => {
    navigate(`/study/tutorial/${encodeURIComponent(topic)}`);
  };

  const handleViewQuestions = (topic: string) => {
    navigate(`/study/questions/${encodeURIComponent(topic)}`);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">📚 Study Materials</h1>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
            <p className="text-base-content/70 mb-8">
              Browse questions, practice MCQs, and read tutorials to prepare for your interviews.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tutorials Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">📖 Tutorials</h2>
                  <div className="space-y-3">
                    {tutorialTopics.map((topic, index) => (
                      <div key={index} className="card bg-base-100 shadow">
                        <div className="card-body p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{topic}</h3>
                            <button
                              onClick={() => handleViewTutorial(topic)}
                              className="btn btn-sm btn-primary"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Practice Questions Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">❓ Practice Questions</h2>
                  <div className="space-y-3">
                    {questionTopics.map((topic, index) => (
                      <div key={index} className="card bg-base-100 shadow">
                        <div className="card-body p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{topic}</h3>
                            <button
                              onClick={() => handleViewQuestions(topic)}
                              className="btn btn-sm btn-primary"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
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
