import React from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { User, UserProfile } from '../types';

// Auth0 configuration
export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: 'openid profile email'
  },
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true
};

// Auth service class
export class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Convert Auth0 user to our User type
  public mapAuth0User(auth0User: any): User {
    return {
      id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name || auth0User.nickname,
      picture: auth0User.picture,
      createdAt: new Date(auth0User.created_at || Date.now()),
      lastLoginAt: new Date(auth0User.updated_at || Date.now())
    };
  }

  // Get user profile from localStorage or create default
  public getUserProfile(userId: string): UserProfile | null {
    const stored = localStorage.getItem(`userProfile_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  // Save user profile to localStorage
  public saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(`userProfile_${profile.userId}`, JSON.stringify(profile));
  }

  // Create default user profile
  public createDefaultProfile(userId: string): UserProfile {
    const defaultProfile: UserProfile = {
      userId,
      role: '',
      position: '',
      experienceLevel: 'junior',
      techStacks: [],
      interviewPreferences: {
        duration: 60,
        difficulty: 'mixed',
        questionMode: 'random',
        questionsPerSet: 10,
        enableRecording: true,
        enableSpeech: true,
        enableCodeEditor: true
      }
    };
    
    this.saveUserProfile(defaultProfile);
    return defaultProfile;
  }

  // Update user profile
  public updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const currentProfile = this.getUserProfile(userId);
    if (!currentProfile) {
      throw new Error('User profile not found');
    }

    const updatedProfile = { ...currentProfile, ...updates };
    this.saveUserProfile(updatedProfile);
    return updatedProfile;
  }

  // Check if user has completed profile setup
  public isProfileComplete(profile: UserProfile): boolean {
    return !!(
      profile.role &&
      profile.position &&
      profile.techStacks.length > 0
    );
  }

  // Get user permissions
  public getUserPermissions(user: User): string[] {
    // Basic permissions for all authenticated users
    const permissions = [
      'interview:start',
      'interview:pause',
      'interview:resume',
      'study:access',
      'profile:update',
      'recordings:view',
      'recordings:download'
    ];

    // Add additional permissions based on user role or subscription
    // This can be extended based on your business logic
    return permissions;
  }

  // Logout and cleanup
  public logout(): void {
    // Clear user-specific data from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('userProfile_') || 
          key.startsWith('interviewSession_') ||
          key.startsWith('recordings_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Check if user can access feature
  public canAccessFeature(user: User, feature: string): boolean {
    const permissions = this.getUserPermissions(user);
    return permissions.includes(feature);
  }

  // Get user's interview history count
  public getInterviewHistoryCount(userId: string): number {
    const keys = Object.keys(localStorage);
    return keys.filter(key => 
      key.startsWith('interviewSession_') && 
      localStorage.getItem(key)?.includes(userId)
    ).length;
  }

  // Check if user is new (first time login)
  public isNewUser(userId: string): boolean {
    return !this.getUserProfile(userId);
  }

  // Get user's preferred language for speech
  public getUserLanguage(userId: string): string {
    const profile = this.getUserProfile(userId);
    return profile?.interviewPreferences?.enableSpeech ? 
      (localStorage.getItem(`speechLanguage_${userId}`) || 'en-US') : 'en-US';
  }

  // Save user's preferred language
  public saveUserLanguage(userId: string, language: string): void {
    localStorage.setItem(`speechLanguage_${userId}`, language);
  }

  // Get user's theme preference
  public getUserTheme(userId: string): 'light' | 'dark' | 'system' {
    return (localStorage.getItem(`theme_${userId}`) as 'light' | 'dark' | 'system') || 'system';
  }

  // Save user's theme preference
  public saveUserTheme(userId: string, theme: 'light' | 'dark' | 'system'): void {
    localStorage.setItem(`theme_${userId}`, theme);
  }

  // Validate Auth0 configuration
  public validateConfig(): boolean {
    return !!(
      process.env.REACT_APP_AUTH0_DOMAIN &&
      process.env.REACT_APP_AUTH0_CLIENT_ID
    );
  }

  // Handle authentication errors
  public handleAuthError(error: any): string {
    console.error('Authentication error:', error);
    
    if (error.error === 'access_denied') {
      return 'Access denied. Please check your credentials.';
    }
    
    if (error.error === 'unauthorized') {
      return 'Unauthorized access. Please log in again.';
    }
    
    if (error.error_description) {
      return error.error_description;
    }
    
    return 'An authentication error occurred. Please try again.';
  }

  // Get user's activity summary
  public getUserActivitySummary(userId: string): {
    totalInterviews: number;
    totalStudyTime: number;
    lastActivity: Date | null;
  } {
    const keys = Object.keys(localStorage);
    let totalInterviews = 0;
    let totalStudyTime = 0;
    let lastActivity: Date | null = null;

    keys.forEach(key => {
      if (key.startsWith('interviewSession_')) {
        const session = JSON.parse(localStorage.getItem(key) || '{}');
        if (session.userId === userId) {
          totalInterviews++;
          if (session.endTime) {
            const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
            totalStudyTime += Math.floor(duration / 60000); // Convert to minutes
            
            const sessionEnd = new Date(session.endTime);
            if (!lastActivity || sessionEnd > lastActivity) {
              lastActivity = sessionEnd;
            }
          }
        }
      }
    });

    return {
      totalInterviews,
      totalStudyTime,
      lastActivity
    };
  }
}

// Custom hook for authentication
export const useAuthService = () => {
  const auth0 = useAuth0();
  const authService = AuthService.getInstance();

  return {
    ...auth0,
    authService,
    mapUser: (auth0User: any) => authService.mapAuth0User(auth0User),
    getUserProfile: (userId: string) => authService.getUserProfile(userId),
    saveUserProfile: (profile: UserProfile) => authService.saveUserProfile(profile),
    createDefaultProfile: (userId: string) => authService.createDefaultProfile(userId),
    updateUserProfile: (userId: string, updates: Partial<UserProfile>) => 
      authService.updateUserProfile(userId, updates),
    isProfileComplete: (profile: UserProfile) => authService.isProfileComplete(profile),
    canAccessFeature: (user: User, feature: string) => authService.canAccessFeature(user, feature),
    isNewUser: (userId: string) => authService.isNewUser(userId),
    handleAuthError: (error: any) => authService.handleAuthError(error)
  };
};

// Auth0 Provider wrapper component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!AuthService.getInstance().validateConfig()) {
    console.error('Auth0 configuration is missing. Please check your environment variables.');
    return React.createElement(
      'div',
      { className: 'min-h-screen flex items-center justify-center bg-base-200' },
      React.createElement(
        'div',
        { className: 'text-center' },
        React.createElement('h1', { className: 'text-2xl font-bold text-error mb-4' }, 'Configuration Error'),
        React.createElement('p', { className: 'text-base-content/70' }, 'Auth0 configuration is missing. Please check your environment variables.')
      )
    );
  }

  return React.createElement(Auth0Provider, auth0Config, children);
};
