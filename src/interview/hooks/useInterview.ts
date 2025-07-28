import { useState, useEffect } from 'react';
import { Question, readQuestions, selectRandomQuestions, selectSequentialQuestions } from '../utils/questionReader';
import { ApiProvider, askQuestion, evaluateInterview } from '../services/aiService';

export type QuestionSelectionType = 'random' | 'sequential' | 'mixed';

interface InterviewState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: string[];
  aiResponses: string[];
  isInterviewActive: boolean;
  isEvaluating: boolean;
  evaluationResult: any | null;
  error: string | null;
  isLoading: boolean;
}

export const useInterview = () => {
  const [state, setState] = useState<InterviewState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    aiResponses: [],
    isInterviewActive: false,
    isEvaluating: false,
    evaluationResult: null,
    error: null,
    isLoading: false
  });
  
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionSelectionType, setQuestionSelectionType] = useState<QuestionSelectionType>('sequential');
  const [apiProvider, setApiProvider] = useState<ApiProvider>('openai');
  
  // Load questions based on selected topics and selection type
  const loadQuestions = async (topics: string[], selectionType: QuestionSelectionType) => {
    try {
      // Set loading state
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
      
      let allQuestions: Question[] = [];
      
      // Collect questions from all selected topics
      for (const topic of topics) {
        const topicQuestions = await readQuestions(topic);
        allQuestions = [...allQuestions, ...topicQuestions];
      }
      
      // Select questions based on selection type
      let selectedQuestions: Question[] = [];
      
      if (selectionType === 'random') {
        selectedQuestions = selectRandomQuestions(allQuestions, 10);
      } else if (selectionType === 'sequential') {
        // For sequential, we'll take the first 10 questions
        selectedQuestions = selectSequentialQuestions(allQuestions, 0, Math.min(10, allQuestions.length));
      } else {
        // For mixed, we'll take a mix of random questions from each topic
        const questionsPerTopic = Math.floor(10 / topics.length);
        selectedQuestions = [];
        
        for (const topic of topics) {
          const topicQuestions = await readQuestions(topic);
          const topicSelection = selectRandomQuestions(topicQuestions, questionsPerTopic);
          selectedQuestions = [...selectedQuestions, ...topicSelection];
        }
        
        // If we don't have 10 questions, fill with random questions
        if (selectedQuestions.length < 10) {
          const remaining = 10 - selectedQuestions.length;
          const additionalQuestions = selectRandomQuestions(allQuestions, remaining);
          selectedQuestions = [...selectedQuestions, ...additionalQuestions];
        }
      }
      
      setState(prev => ({
        ...prev,
        questions: selectedQuestions,
        currentQuestionIndex: 0,
        userAnswers: [],
        aiResponses: [],
        isInterviewActive: true,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load questions. Please try again.'
      }));
    }
  };
  
  // Start the interview
  const startInterview = async (topics: string[], selectionType: QuestionSelectionType, provider: ApiProvider) => {
    setSelectedTopics(topics);
    setQuestionSelectionType(selectionType);
    setApiProvider(provider);
    await loadQuestions(topics, selectionType);
  };
  
  // Submit an answer to the current question
  const submitAnswer = async (answer: string) => {
    try {
      // Store the user's answer
      const newUserAnswers = [...state.userAnswers, answer];
      
      // Get AI response
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const aiResponse = await askQuestion(
        `Question: ${currentQuestion.question}\n\nUser's Answer: ${answer}\n\nIs this answer correct? Provide feedback.`,
        apiProvider
      );
      
      const newAiResponses = [...state.aiResponses, aiResponse];
      
      // Update state
      setState(prev => ({
        ...prev,
        userAnswers: newUserAnswers,
        aiResponses: newAiResponses,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to get AI response. Please try again.'
      }));
    }
  };
  
  // Continue to next set of questions
  const continueInterview = async () => {
    await loadQuestions(selectedTopics, questionSelectionType);
  };
  
  // Evaluate the interview
  const evaluateInterviewPerformance = async () => {
    setState(prev => ({
      ...prev,
      isEvaluating: true
    }));
    
    try {
      const questions = state.questions.map(q => q.question);
      const correctAnswers = state.questions.map(q => q.answer);
      
      const evaluation = await evaluateInterview(
        questions,
        state.userAnswers,
        correctAnswers,
        apiProvider
      );
      
      setState(prev => ({
        ...prev,
        isEvaluating: false,
        evaluationResult: evaluation,
        isInterviewActive: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isEvaluating: false,
        error: 'Failed to evaluate interview. Please try again.'
      }));
    }
  };
  
  // Reset the interview
  const resetInterview = () => {
    setState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      aiResponses: [],
      isInterviewActive: false,
      isEvaluating: false,
      evaluationResult: null,
      error: null,
      isLoading: false
    });
  };
  
  // Check if interview is complete
  const isInterviewComplete = state.currentQuestionIndex >= state.questions.length && state.questions.length > 0;
  
  // Get current question
  const currentQuestion = state.questions[state.currentQuestionIndex];
  
  return {
    ...state,
    selectedTopics,
    questionSelectionType,
    apiProvider,
    startInterview,
    submitAnswer,
    continueInterview,
    evaluateInterviewPerformance,
    resetInterview,
    isInterviewComplete,
    currentQuestion
  };
};
