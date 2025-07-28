import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  size: string;
  thumbnail: string;
}

export const RecordingManager: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      title: 'JavaScript Technical Interview Practice',
      date: '2023-05-15',
      duration: '15:32',
      size: '125 MB',
      thumbnail: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=JS+Interview'
    },
    {
      id: '2',
      title: 'React Frontend Interview',
      date: '2023-05-10',
      duration: '18:45',
      size: '156 MB',
      thumbnail: 'https://placehold.co/300x200/10B981/FFFFFF?text=React+Interview'
    },
    {
      id: '3',
      title: 'System Design Mock Interview',
      date: '2023-05-05',
      duration: '22:18',
      size: '210 MB',
      thumbnail: 'https://placehold.co/300x200/8B5CF6/FFFFFF?text=System+Design'
    }
  ]);

  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  const handleDeleteRecording = (id: string) => {
    setRecordings(recordings.filter(recording => recording.id !== id));
    if (selectedRecording && selectedRecording.id === id) {
      setSelectedRecording(null);
    }
  };

  const handleDownloadRecording = (id: string) => {
    // In a real implementation, this would trigger a download
    alert(`Downloading recording ${id}`);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">🎥 Recording Manager</h1>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>

            <p className="text-base-content/70 mb-8">
              Manage your interview recordings and practice sessions.
            </p>

            {selectedRecording ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{selectedRecording.title}</h2>
                  <button 
                    onClick={() => setSelectedRecording(null)}
                    className="btn btn-outline"
                  >
                    Back to List
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="card bg-base-200">
                      <div className="card-body">
                        <div className="aspect-video bg-base-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🎥</div>
                            <p className="text-lg">Interview Recording Player</p>
                            <p className="text-base-content/60 mt-2">Video player would appear here</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="card-title text-lg">Recording Details</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-base-content/60">Date</p>
                            <p>{selectedRecording.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-base-content/60">Duration</p>
                            <p>{selectedRecording.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-base-content/60">File Size</p>
                            <p>{selectedRecording.size}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Actions</h3>
                        <div className="space-y-3">
                          <button 
                            className="btn btn-primary w-full"
                            onClick={() => handleDownloadRecording(selectedRecording.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download
                          </button>
                          <button 
                            className="btn btn-outline w-full"
                            onClick={() => handleDeleteRecording(selectedRecording.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Recordings</h2>
                  <div className="flex space-x-2">
                    <button className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      New Recording
                    </button>
                  </div>
                </div>

                {recordings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recordings.map((recording) => (
                      <div key={recording.id} className="card bg-base-200 hover:shadow-lg transition-shadow">
                        <div className="card-body p-4">
                          <div className="aspect-video bg-base-300 rounded-lg mb-3 flex items-center justify-center">
                            <img 
                              src={recording.thumbnail} 
                              alt={recording.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <h3 className="font-bold text-lg mb-1">{recording.title}</h3>
                          <div className="flex justify-between text-sm text-base-content/60 mb-3">
                            <span>{recording.date}</span>
                            <span>{recording.duration}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              className="btn btn-sm btn-primary flex-1"
                              onClick={() => setSelectedRecording(recording)}
                            >
                              View
                            </button>
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleDownloadRecording(recording.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline btn-error"
                              onClick={() => handleDeleteRecording(recording.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-2xl font-bold mb-2">No recordings yet</h3>
                    <p className="text-base-content/60 mb-6">Start your first interview to create a recording.</p>
                    <Link to="/interview/setup" className="btn btn-primary">
                      Start Interview
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
