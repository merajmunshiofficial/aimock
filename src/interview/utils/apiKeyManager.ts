// API key storage keys
const OPENAI_API_KEY = 'openai_api_key';
const PERPLEXITY_API_KEY = 'perplexity_api_key';

/**
 * Stores the OpenAI API key in localStorage
 * @param apiKey The OpenAI API key
 */
export const storeOpenAIApiKey = (apiKey: string): void => {
  localStorage.setItem(OPENAI_API_KEY, apiKey);
};

/**
 * Stores the Perplexity API key in localStorage
 * @param apiKey The Perplexity API key
 */
export const storePerplexityApiKey = (apiKey: string): void => {
  localStorage.setItem(PERPLEXITY_API_KEY, apiKey);
};

/**
 * Retrieves the OpenAI API key from localStorage
 * @returns The OpenAI API key or null if not found
 */
export const getOpenAIApiKey = (): string | null => {
  return localStorage.getItem(OPENAI_API_KEY);
};

/**
 * Retrieves the Perplexity API key from localStorage
 * @returns The Perplexity API key or null if not found
 */
export const getPerplexityApiKey = (): string | null => {
  return localStorage.getItem(PERPLEXITY_API_KEY);
};

/**
 * Removes all API keys from localStorage
 */
export const clearApiKeys = (): void => {
  localStorage.removeItem(OPENAI_API_KEY);
  localStorage.removeItem(PERPLEXITY_API_KEY);
};

/**
 * Checks if API keys are stored
 * @returns True if at least one API key is stored
 */
export const hasApiKeys = (): boolean => {
  return !!getOpenAIApiKey() || !!getPerplexityApiKey();
};
