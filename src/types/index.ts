// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
  experienceLevel?: 'junior' | 'mid' | 'senior';
  preferredTechStacks?: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserProfile {
  userId: string;
  role: string;
  position: string;
  experienceLevel: 'junior' | 'mid' | 'senior';
  techStacks: string[];
  interviewPreferences: InterviewPreferences;
}

export interface InterviewPreferences {
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  questionMode: 'sequential' | 'random';
  questionsPerSet: number;
  enableRecording: boolean;
  enableSpeech: boolean;
  enableCodeEditor: boolean;
}

// Question and Content Types
export interface Question {
  id: number;
  question: string;
  answer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'concepts' | 'coding' | 'scenario';
  techStack: string;
  tags?: string[];
  followUpQuestions?: string[];
}

export interface QuestionBank {
  techStack: string;
  questions: Question[];
  metadata: {
    totalQuestions: number;
    lastUpdated: string;
    version: string;
  };
}

export interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack: string;
  tags?: string[];
}

export interface MCQBank {
  techStack: string;
  mcqs: MCQ[];
  metadata: {
    totalMCQs: number;
    lastUpdated: string;
    version: string;
  };
}

export interface Tutorial {
  id: string;
  title: string;
  techStack: string;
  content: string; // Markdown content
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // in minutes
  tags: string[];
  lastUpdated: string;
}

// Interview Types
export interface InterviewSession {
  id: string;
  userId: string;
  type: 'single' | 'mixed' | 'custom';
  techStacks: string[];
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  evaluations: InterviewEvaluation[];
  settings: InterviewSettings;
  recordings?: RecordingData[];
}

export interface InterviewQuestion {
  id: string;
  originalQuestion: Question;
  aiGeneratedContext?: string;
  followUpQuestions?: string[];
  askedAt: Date;
  skipped: boolean;
}

export interface InterviewResponse {
  questionId: string;
  response: string;
  responseType: 'text' | 'voice' | 'code';
  timestamp: Date;
  duration: number; // in seconds
  confidence?: number; // for speech recognition
  codeSubmission?: CodeSubmission;
}

export interface InterviewEvaluation {
  sessionId: string;
  questionRange: { start: number; end: number };
  overallScore: number;
  skillAssessment: SkillAssessment[];
  feedback: string;
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
  evaluatedAt: Date;
}

export interface SkillAssessment {
  skill: string;
  score: number; // 0-100
  level: 'beginner' | 'intermediate' | 'advanced';
  feedback: string;
}

export interface InterviewSettings {
  questionMode: 'sequential' | 'random';
  questionsPerSet: number;
  enableRecording: boolean;
  enableSpeech: boolean;
  enableCodeEditor: boolean;
  autoEvaluate: boolean;
  evaluationInterval: number;
}

// Recording Types
export interface RecordingData {
  id: string;
  sessionId: string;
  type: 'audio' | 'video' | 'screen';
  filename: string;
  duration: number;
  size: number; // in bytes
  format: string;
  createdAt: Date;
  blob?: Blob;
  url?: string;
}

export interface RecordingSettings {
  audio: {
    enabled: boolean;
    bitrate: number;
    sampleRate: number;
  };
  video: {
    enabled: boolean;
    width: number;
    height: number;
    frameRate: number;
    bitrate: number;
  };
  screen: {
    enabled: boolean;
    includeAudio: boolean;
  };
}

// Code Editor Types
export interface CodeSubmission {
  id: string;
  questionId: string;
  code: string;
  language: string;
  timestamp: Date;
  executionResult?: ExecutionResult;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
}

export interface CodeEditorSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  language: string;
  autoComplete: boolean;
  lineNumbers: boolean;
  wordWrap: boolean;
}

// Speech Types
export interface SpeechSettings {
  recognition: {
    enabled: boolean;
    language: string;
    continuous: boolean;
    interimResults: boolean;
  };
  synthesis: {
    enabled: boolean;
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
  };
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
}

// AI Service Types
export interface AIServiceConfig {
  provider: 'openai' | 'perplexity';
  model: string;
  apiKey: string;
  maxTokens: number;
  temperature: number;
}

export interface AIRequest {
  type: 'question' | 'evaluation' | 'followup' | 'feedback';
  context: string;
  userProfile: UserProfile;
  sessionHistory: InterviewResponse[];
  currentQuestion?: Question;
}

export interface AIResponse {
  content: string;
  type: 'question' | 'evaluation' | 'followup' | 'feedback';
  confidence: number;
  metadata?: {
    tokensUsed: number;
    processingTime: number;
    model: string;
  };
}

// Dashboard Types
export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  totalStudyTime: number; // in minutes
  favoriteTopics: string[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'interview' | 'study' | 'practice';
  title: string;
  description: string;
  timestamp: Date;
  duration?: number;
  score?: number;
}

// Navigation and UI Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavigationItem[];
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
