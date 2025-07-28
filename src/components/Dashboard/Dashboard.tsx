import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { listInterviewSessions, InterviewSessionRecord } from '../../services/progress.service';

import { LoadingSpinner } from '../Common/LoadingSpinner';

interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  totalStudyTime: number;
  favoriteTopics: string[];
  recentActivity: { title: string; description: string; timestamp: number }[];
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth0();


  const [sessions, setSessions] = useState<InterviewSessionRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCompute = async () => {
      if (!user?.sub) return;
      const data = await listInterviewSessions(user.sub, 100);
      setSessions(data);

      // Compute stats
      const totalInterviews = data.length;
      const completedInterviews = data.length; // all saved sessions are completed
      const averageScore = data.length ? Math.round(data.reduce((sum, s) => sum + (s.score || 0), 0) / data.length) : 0;
      const favoriteCount: Record<string, number> = {};
      data.forEach((s) => {
        s.topic.split(',').forEach((t) => {
          const key = t.trim();
          if (key) favoriteCount[key] = (favoriteCount[key] || 0) + 1;
        });
      });
      const favoriteTopics = Object.entries(favoriteCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => t);

      const recentActivity = data.slice(0, 5).map((s) => ({
        title: 'Interview Completed',
        description: s.topic,
        timestamp: s.finishedAt.toMillis()
      }));

      setStats({ totalInterviews, completedInterviews, averageScore, totalStudyTime: 0, favoriteTopics, recentActivity });
      setLoading(false);
    };
    fetchAndCompute();
  }, [user]);

  if (!user || loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <div className="text-xl font-bold">🎯 AI Mock Interview</div>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {user.picture ? (
                  <img src={user.picture} alt={user.name || 'User'} />
                ) : (
                  <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/profile">Profile Settings</Link></li>
              <li><Link to="/recordings">My Recordings</Link></li>
              <li><button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Welcome back, {user.name || user.email}! 👋
          </h1>
          <p className="text-base-content/70">
            Ready to practice your interview skills?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Interviews</div>
            <div className="stat-value text-primary">{stats.totalInterviews}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Average Score</div>
            <div className="stat-value text-secondary">{stats.averageScore}%</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Study Time</div>
            <div className="stat-value text-accent">{stats.totalStudyTime}m</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">{stats.completedInterviews}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Start Interview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">🚀 Start Interview</h2>
              <p className="text-base-content/70 mb-6">
                Begin a new AI-powered mock interview session
              </p>
              <div className="card-actions">
                <Link to="/interview/setup" className="btn btn-primary btn-lg w-full">
                  Start New Interview
                </Link>
              </div>
            </div>
          </div>

          {/* Study Materials */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">📚 Study Materials</h2>
              <p className="text-base-content/70 mb-6">
                Browse questions, practice MCQs, and read tutorials
              </p>
              <div className="card-actions">
                <Link to="/study" className="btn btn-secondary btn-lg w-full">
                  Browse Materials
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">📈 Recent Activity</h2>
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-base-content/60">{activity.description}</div>
                      </div>
                      <div className="text-sm text-base-content/60">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No recent activity yet. Start your first interview!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
