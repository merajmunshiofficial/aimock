import React from 'react';
import { Link } from 'react-router-dom';

export const StudyMaterials: React.FC = () => {
  // Actual tutorial topics from the data directory
  const tutorialTopics = [
    { id: 'java', title: 'Java Fundamentals', duration: '45 min', difficulty: 'Intermediate' },
    { id: 'System-Design', title: 'System Design', duration: '60 min', difficulty: 'Advanced' },
    { id: 'Spring-Boot-and-Microservice', title: 'Spring Boot and Microservice', duration: '50 min', difficulty: 'Intermediate' },
    { id: 'LLD', title: 'Low Level Design', duration: '55 min', difficulty: 'Advanced' },
    { id: 'mvc', title: 'MVC Architecture', duration: '40 min', difficulty: 'Beginner' },
  ];
  
  // Actual question topics from the data directory
  const questionTopics = [
    { id: 'java', title: 'Java Questions', count: 50, type: 'Technical' },
    { id: 'SystemDesign', title: 'System Design Questions', count: 30, type: 'Technical' },
    { id: 'SpringBootandMicroservice', title: 'Spring Boot and Microservice Questions', count: 40, type: 'Technical' },
    { id: 'lld', title: 'Low Level Design Questions', count: 25, type: 'Technical' },
    { id: 'mvc', title: 'MVC Questions', count: 35, type: 'Technical' },
  ];
  
  // MCQ topics
  const mcqTopics = [
    { id: 'javascript-fundamentals', title: 'JavaScript Fundamentals', count: 50 },
    { id: 'react-basics', title: 'React Basics', count: 40 },
    { id: 'css-layout', title: 'CSS Layout', count: 30 },
    { id: 'html-semantics', title: 'HTML Semantics', count: 25 },
    { id: 'nodejs-concepts', title: 'Node.js Concepts', count: 35 },
  ];
  
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tutorials Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">📖 Tutorials</h2>
                  <div className="space-y-4">
                    {tutorialTopics.map((tutorial) => (
                      <div key={tutorial.id} className="card bg-base-100 hover:bg-base-300 transition-colors">
                        <div className="card-body py-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">{tutorial.title}</h3>
                            <span className="badge badge-outline">{tutorial.difficulty}</span>
                          </div>
                          <p className="text-base-content/60 text-sm mt-2">Duration: {tutorial.duration}</p>
                          <div className="card-actions justify-end mt-3">
                            <Link to={`/study/tutorial/${tutorial.id}`} className="btn btn-sm btn-primary">
                              Start Tutorial
                            </Link>
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
                  <div className="space-y-4">
                    {questionTopics.map((question) => (
                      <div key={question.id} className="card bg-base-100 hover:bg-base-300 transition-colors">
                        <div className="card-body py-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">{question.title}</h3>
                            <span className="badge badge-outline">{question.type}</span>
                          </div>
                          <p className="text-base-content/60 text-sm mt-2">{question.count} questions available</p>
                          <div className="card-actions justify-end mt-3">
                            <Link to={`/study/questions/${question.id}`} className="btn btn-sm btn-primary">
                              Practice
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* MCQ Tests Section */}
              <div className="card bg-base-200 lg:col-span-2">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">📝 Multiple Choice Questions (MCQs)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mcqTopics.map((topic) => (
                      <div key={topic.id} className="card bg-base-100 hover:bg-base-300 transition-colors">
                        <div className="card-body py-4">
                          <h3 className="font-bold text-lg">{topic.title}</h3>
                          <p className="text-base-content/60 text-sm mt-2">{topic.count} questions available</p>
                          <div className="card-actions justify-end mt-3">
                            <Link to={`/study/mcq-test/${topic.id}`} className="btn btn-sm btn-primary">
                              Start Test
                            </Link>
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
