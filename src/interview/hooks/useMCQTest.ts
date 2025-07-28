import { useState, useEffect } from 'react';
import { MCQQuestion, MCQTestSession, MCQTestResult } from '../types/mcqTypes';
import { loadMCQsByTopic, getRandomMCQs, getSequentialMCQs } from '../utils/mcqReader';

export const useMCQTest = () => {
  const [testSession, setTestSession] = useState<MCQTestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize a new MCQ test
  const startTest = async (topic: string, count: number = 10, mode: 'random' | 'sequential' = 'random') => {
    setIsLoading(true);
    setError(null);
    
    try {
      let questions: MCQQuestion[] | null = null;
      
      if (mode === 'random') {
        questions = await getRandomMCQs(topic, count);
      } else {
        questions = await getSequentialMCQs(topic, count);
      }
      
      if (!questions || questions.length === 0) {
        throw new Error(`No questions found for topic: ${topic}`);
      }
      
      const newSession: MCQTestSession = {
        topic,
        questions,
        userAnswers: Array(questions.length).fill(-1), // -1 indicates unanswered
        results: [],
        startTime: new Date(),
        endTime: null,
        score: null
      };
      
      setTestSession(newSession);
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start MCQ test');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit an answer for the current question
  const submitAnswer = (selectedOption: number) => {
    if (!testSession) return;
    
    const newAnswers = [...testSession.userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    
    setTestSession({
      ...testSession,
      userAnswers: newAnswers
    });
    
    // Auto-move to next question
    if (currentQuestionIndex < testSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to a specific question
  const goToQuestion = (index: number) => {
    if (!testSession || index < 0 || index >= testSession.questions.length) return;
    setCurrentQuestionIndex(index);
  };

  // Evaluate the test and calculate results
  const evaluateTest = () => {
    if (!testSession) return;
    
    const results: MCQTestResult[] = testSession.questions.map((question, index) => {
      const userAnswer = testSession.userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      return {
        questionId: question.id,
        selectedOption: userAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      };
    });
    
    const correctAnswers = results.filter(result => result.isCorrect).length;
    const score = Math.round((correctAnswers / testSession.questions.length) * 100);
    
    setTestSession({
      ...testSession,
      results,
      endTime: new Date(),
      score
    });
  };

  // Reset the test session
  const resetTest = () => {
    setTestSession(null);
    setCurrentQuestionIndex(0);
    setError(null);
  };

  // Get the current question
  const currentQuestion = testSession?.questions[currentQuestionIndex] || null;
  
  // Check if all questions have been answered
  const isTestComplete = testSession ? 
    testSession.userAnswers.every(answer => answer !== -1) : false;

  return {
    // State
    testSession,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    error,
    isTestComplete,
    
    // Methods
    startTest,
    submitAnswer,
    goToQuestion,
    evaluateTest,
    resetTest
  };
};
