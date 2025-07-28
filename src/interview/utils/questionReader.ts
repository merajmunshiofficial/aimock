export interface Question {
  question: string;
  answer: string;
}

/**
 * Reads a question JSON file
 * @param topic The topic of the questions (e.g., 'java', 'SpringBootandMicroservice')
 * @returns Array of questions and answers
 */
export const readQuestions = async (topic: string): Promise<Question[]> => {
  try {
    // Dynamically import the JSON file
    const module = await import(`../../data/questions/${topic}.json`);
    return module.default;
  } catch (error) {
    console.error(`Error reading questions for topic ${topic}:`, error);
    throw new Error(`Could not read questions for topic: ${topic}`);
  }
};

/**
 * Gets a list of available question topics
 * @returns Array of question topic names
 */
export const getQuestionTopics = (): string[] => {
  // In a real implementation, this would read the directory and extract topic names
  // For now, we'll return a hardcoded list based on the files we know exist
  return ['java', 'SpringBootandMicroservice', 'SystemDesign', 'LLD', 'mvc'];
};

/**
 * Selects a random set of questions from an array
 * @param questions Array of questions
 * @param count Number of questions to select
 * @returns Array of randomly selected questions
 */
export const selectRandomQuestions = (questions: Question[], count: number): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Selects a sequential set of questions from an array
 * @param questions Array of questions
 * @param startIndex Index to start selection from
 * @param count Number of questions to select
 * @returns Array of sequentially selected questions
 */
export const selectSequentialQuestions = (questions: Question[], startIndex: number, count: number): Question[] => {
  return questions.slice(startIndex, startIndex + count);
};
