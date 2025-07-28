export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface MCQTopic {
  topic: string;
  questions: MCQQuestion[];
}

export interface MCQTestResult {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  correctAnswer: number;
  explanation: string;
}

export interface MCQTestSession {
  topic: string;
  questions: MCQQuestion[];
  userAnswers: number[]; // Index corresponds to question index
  results: MCQTestResult[];
  startTime: Date;
  endTime: Date | null;
  score: number | null;
}
