import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { listInterviewSessions, InterviewSessionRecord } from '../../services/progress.service';
import { LoadingSpinner } from '../Common/LoadingSpinner';

export const InterviewHistory: React.FC = () => {
  const { user } = useAuth0();
  const [sessions, setSessions] = useState<InterviewSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.sub) return;
      try {
        const data = await listInterviewSessions(user.sub, 100);
        setSessions(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading history..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold mb-4">🗂️ Interview History</h1>

        {sessions.length === 0 ? (
          <div className="text-center py-12 text-base-content/60">
            <div className="text-5xl mb-2">📭</div>
            <p>No interviews saved yet. Complete an interview to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s.sessionId} className="card bg-base-100 shadow">
                <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="card-title text-xl">{s.topic}</h2>
                    <p className="text-sm text-base-content/60">
                      Finished {s.finishedAt.toDate().toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className="badge badge-primary badge-lg text-lg p-4">
                      {s.score}%
                    </div>
                    <a
                      href={`/interview/results/${s.sessionId}`}
                      className="btn btn-secondary"
                    >
                      View Results
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
