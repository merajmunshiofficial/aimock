import { MCQTopic, MCQQuestion } from '../types';

// Function to get all available MCQ topics
export const getMCQTopics = (): string[] => {
  // In a real implementation, this would read the directory structure
  // For now, we'll return a static list
  return [
    'javascript-fundamentals',
    'react-basics',
    'css-layout',
    'html-semantics',
    'nodejs-concepts'
  ];
};

// Function to load MCQs by topic
export const loadMCQsByTopic = async (topic: string): Promise<MCQTopic | null> => {
  try {
    // In a real implementation, this would dynamically import the JSON file
    // For now, we'll simulate loading with a switch statement
    switch (topic) {
      case 'javascript-fundamentals':
        return {
          topic: 'JavaScript Fundamentals',
          questions: [
            {
              id: 1,
              question: 'What is the correct way to declare a variable that cannot be reassigned?',
              options: [
                'var myVar = 10;',
                'let myVar = 10;',
                'const myVar = 10;',
                'immutable myVar = 10;'
              ],
              correctAnswer: 2,
              explanation: 'The \'const\' keyword declares variables that cannot be reassigned.'
            }
          ]
        };
      default:
        // Try to load the actual JSON file
        const module = await import(`../../data/mcqs/${topic}.json`);
        return module.default as MCQTopic;
    }
  } catch (error) {
    console.error(`Error loading MCQs for topic ${topic}:`, error);
    return null;
  }
};

// Function to get a random set of MCQs
export const getRandomMCQs = async (topic: string, count: number): Promise<MCQQuestion[] | null> => {
  const mcqTopic = await loadMCQsByTopic(topic);
  if (!mcqTopic) return null;
  
  // Shuffle the questions and return the requested count
  const shuffled = [...mcqTopic.questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Function to get sequential MCQs
export const getSequentialMCQs = async (topic: string, count: number, startIndex: number = 0): Promise<MCQQuestion[] | null> => {
  const mcqTopic = await loadMCQsByTopic(topic);
  if (!mcqTopic) return null;
  
  return mcqTopic.questions.slice(startIndex, startIndex + Math.min(count, mcqTopic.questions.length - startIndex));
};
