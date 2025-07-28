import { getOpenAIApiKey, getPerplexityApiKey } from '../utils/apiKeyManager';
import { Question } from '../utils/questionReader';

// API endpoints
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export type ApiProvider = 'openai' | 'perplexity';

export interface InterviewEvaluation {
  overallScore: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}

/**
 * Asks a question using the specified AI provider
 * @param question The question to ask
 * @param provider The AI provider to use
 * @returns The AI's response
 */
export const askQuestion = async (question: string, provider: ApiProvider): Promise<string> => {
  const apiKey = provider === 'openai' ? getOpenAIApiKey() : getPerplexityApiKey();
  
  if (!apiKey) {
    throw new Error(`API key not found for ${provider}`);
  }

  const apiUrl = provider === 'openai' ? OPENAI_API_URL : PERPLEXITY_API_URL;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  
  const body = {
    model: provider === 'openai' ? 'gpt-3.5-turbo' : 'llama-3-sonar-small-32k-chat',
    messages: [
      {
        role: 'system',
        content: 'You are an interviewer conducting a technical interview. Ask clear, concise questions and evaluate responses professionally.'
      },
      {
        role: 'user',
        content: question
      }
    ]
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error asking question with ${provider}:`, error);
    throw new Error(`Failed to ask question with ${provider}`);
  }
};

/**
 * Evaluates the user's interview performance
 * @param questions Array of questions asked
 * @param answers Array of user's answers
 * @param correctAnswers Array of correct answers
 * @param provider The AI provider to use for evaluation
 * @returns Evaluation results
 */
export const evaluateInterview = async (
  questions: string[],
  answers: string[],
  correctAnswers: string[],
  provider: ApiProvider
): Promise<InterviewEvaluation> => {
  const apiKey = provider === 'openai' ? getOpenAIApiKey() : getPerplexityApiKey();
  
  if (!apiKey) {
    throw new Error(`API key not found for ${provider}`);
  }

  const apiUrl = provider === 'openai' ? OPENAI_API_URL : PERPLEXITY_API_URL;
  
  // Prepare the evaluation prompt
  let evaluationPrompt = 'Evaluate the following interview performance:\n\n';
  evaluationPrompt += 'Questions and Answers:\n';
  
  for (let i = 0; i < questions.length; i++) {
    evaluationPrompt += `\nQuestion ${i + 1}: ${questions[i]}\n`;
    evaluationPrompt += `User's Answer: ${answers[i]}\n`;
    evaluationPrompt += `Correct Answer: ${correctAnswers[i]}\n`;
  }
  
  evaluationPrompt += '\nPlease provide a score out of 100, detailed feedback, strengths, and weaknesses in the following JSON format:\n';
  evaluationPrompt += '{\n  "score": number,\n  "feedback": string,\n  "strengths": string[],\n  "weaknesses": string[]\n}';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  
  const body = {
    model: provider === 'openai' ? 'gpt-3.5-turbo' : 'llama-3-sonar-small-32k-chat',
    messages: [
      {
        role: 'system',
        content: 'You are an expert interviewer evaluator. Provide fair and constructive feedback on interview performance.'
      },
      {
        role: 'user',
        content: evaluationPrompt
      }
    ],
    response_format: { type: 'json_object' }
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const evaluationResult = JSON.parse(data.choices[0].message.content);
    
    return {
      overallScore: evaluationResult.score,
      feedback: evaluationResult.feedback,
      strengths: evaluationResult.strengths,
      weaknesses: evaluationResult.weaknesses
    };
  } catch (error) {
    console.error(`Error evaluating interview with ${provider}:`, error);
    throw new Error(`Failed to evaluate interview with ${provider}`);
  }
};
