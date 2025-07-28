import React, { createContext, useContext, useReducer, useEffect, ReactNode, useMemo } from 'react';
import { User, UserProfile, InterviewSession, ThemeSettings, DashboardStats } from '../types';
import { useAuthService } from '../services/auth.service';

// App State Interface
interface AppState {
  user: User | null;
  userProfile: UserProfile | null;
  currentSession: InterviewSession | null;
  theme: ThemeSettings;
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
}

// Action Types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_CURRENT_SESSION'; payload: InterviewSession | null }
  | { type: 'UPDATE_SESSION'; payload: Partial<InterviewSession> }
  | { type: 'SET_THEME'; payload: ThemeSettings }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: AppState = {
  user: null,
  userProfile: null,
  currentSession: null,
  theme: {
    mode: 'system',
    primaryColor: '#3b82f6',
    fontSize: 'medium',
    animations: true
  },
  dashboardStats: null,
  loading: false,
  error: null,
  isOnline: navigator.onLine
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: state.userProfile
          ? { ...state.userProfile, ...action.payload }
          : null
      };
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        currentSession: state.currentSession
          ? { ...state.currentSession, ...action.payload }
          : null
      };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'RESET_STATE':
      return { ...initialState, isOnline: state.isOnline };
    
    default:
      return state;
  }
};

// Context Interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setUser: (user: User | null) => void;
    setUserProfile: (profile: UserProfile | null) => void;
    updateUserProfile: (updates: Partial<UserProfile>) => void;
    setCurrentSession: (session: InterviewSession | null) => void;
    updateSession: (updates: Partial<InterviewSession>) => void;
    setTheme: (theme: ThemeSettings) => void;
    setDashboardStats: (stats: DashboardStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    resetState: () => void;
  };
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { authService } = useAuthService();

  // Action creators
  const actions = useMemo(() => ({
    setUser: (user: User | null) => dispatch({ type: 'SET_USER', payload: user }),
    setUserProfile: (profile: UserProfile | null) => dispatch({ type: 'SET_USER_PROFILE', payload: profile }),
    updateUserProfile: (updates: Partial<UserProfile>) => dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates }),
    setCurrentSession: (session: InterviewSession | null) => dispatch({ type: 'SET_CURRENT_SESSION', payload: session }),
    updateSession: (updates: Partial<InterviewSession>) => dispatch({ type: 'UPDATE_SESSION', payload: updates }),
    setTheme: (theme: ThemeSettings) => dispatch({ type: 'SET_THEME', payload: theme }),
    setDashboardStats: (stats: DashboardStats) => dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    resetState: () => dispatch({ type: 'RESET_STATE' })
  }), []);

  // Load user profile when user changes
  useEffect(() => {
    if (state.user) {
      const profile = authService.getUserProfile(state.user.id);
      if (profile) {
        actions.setUserProfile(profile);
      } else if (authService.isNewUser(state.user.id)) {
        const defaultProfile = authService.createDefaultProfile(state.user.id);
        actions.setUserProfile(defaultProfile);
      }

      // Load user theme only if different to avoid rerender loop
      const themeMode = authService.getUserTheme(state.user.id);
      if (state.theme.mode !== themeMode) {
        actions.setTheme({ ...state.theme, mode: themeMode });
      }

      // Load dashboard stats
      const activitySummary = authService.getUserActivitySummary(state.user.id);
      const dashboardStats: DashboardStats = {
        totalInterviews: activitySummary.totalInterviews,
        completedInterviews: activitySummary.totalInterviews, // Assuming all are completed for now
        averageScore: 75, // Default score
        totalStudyTime: activitySummary.totalStudyTime,
        favoriteTopics: ['React', 'JavaScript'], // Default topics
        recentActivity: []
      };
      actions.setDashboardStats(dashboardStats);
    } else {
      actions.setUserProfile(null);
      // Don't set dashboard stats to null, just leave it as is
    }
  }, [state.user, authService, actions]);

  // Save user profile changes
  useEffect(() => {
    if (state.user && state.userProfile) {
      authService.saveUserProfile(state.userProfile);
    }
  }, [state.userProfile, authService, state.user]);

  // Save theme changes
  useEffect(() => {
    if (state.user) {
      authService.saveUserTheme(state.user.id, state.theme.mode);
    }
    const root = document.documentElement;
    if (state.theme.mode === 'light' || state.theme.mode === 'dark') {
      root.setAttribute('data-theme', state.theme.mode);
    } else { // 'system' mode
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      };

      handleChange(); // Set initial theme
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.theme.mode]);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Error auto-clear
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        actions.clearError();
      }, 5000); // Clear error after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [state.error, actions]);

  const contextValue: AppContextType = {
    state,
    dispatch,
    actions
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Selector hooks for specific state slices
export const useUser = () => {
  const { state } = useAppContext();
  return state.user;
};

export const useUserProfile = () => {
  const { state } = useAppContext();
  return state.userProfile;
};

export const useCurrentSession = () => {
  const { state } = useAppContext();
  return state.currentSession;
};

export const useTheme = () => {
  const { state } = useAppContext();
  return state.theme;
};

export const useDashboardStats = () => {
  const { state } = useAppContext();
  return state.dashboardStats;
};

export const useAppLoading = () => {
  const { state } = useAppContext();
  return state.loading;
};

export const useAppError = () => {
  const { state } = useAppContext();
  return state.error;
};

export const useOnlineStatus = () => {
  const { state } = useAppContext();
  return state.isOnline;
};

// Higher-order component for error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    const { actions } = useAppContext();

    const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
      useEffect(() => {
        const handleError = (event: ErrorEvent) => {
          actions.setError(`Unexpected error: ${event.message}`);
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
          actions.setError(`Unhandled promise rejection: ${event.reason}`);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
          window.removeEventListener('error', handleError);
          window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
      }, []);

      return <>{children}</>;
    };

    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const { actions } = useAppContext();

  useEffect(() => {
    // Monitor performance
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            if (navEntry.loadEventEnd && navEntry.fetchStart) {
              const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
              if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime);
              }
            }
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'measure'] });

      return () => observer.disconnect();
    }
  }, []);
};
