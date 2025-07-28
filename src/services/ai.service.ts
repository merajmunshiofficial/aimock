import { AIServiceConfig, AIRequest, AIResponse, Question, UserProfile, InterviewResponse } from '../types';

// OpenAI types (since we can't import the full library in browser)
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: {
    total_tokens?: number;
  };
}

// AI Service class for handling OpenAI and Perplexity integrations
export class AIService {
  private static instance: AIService;
  private currentProvider: 'openai' | 'perplexity' = 'openai';

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Switch between AI providers
  public setProvider(provider: 'openai' | 'perplexity'): void {
    this.currentProvider = provider;
  }

  // Generate interview questions based on user profile and context
  public async generateInterviewQuestion(
    userProfile: UserProfile,
    questionHistory: InterviewResponse[],
    currentTopic?: string
  ): Promise<AIResponse> {
    const context = this.buildQuestionContext(userProfile, questionHistory, currentTopic);
    
    const request: AIRequest = {
      type: 'question',
      context,
      userProfile,
      sessionHistory: questionHistory
    };

    return this.processAIRequest(request);
  }

  // Generate follow-up questions based on user response
  public async generateFollowUpQuestion(
    originalQuestion: Question,
    userResponse: string,
    userProfile: UserProfile
  ): Promise<AIResponse> {
    const context = this.buildFollowUpContext(originalQuestion, userResponse, userProfile);
    
    const request: AIRequest = {
      type: 'followup',
      context,
      userProfile,
      sessionHistory: [],
      currentQuestion: originalQuestion
    };

    return this.processAIRequest(request);
  }

  // Evaluate user responses and provide feedback
  public async evaluateResponse(
    question: Question,
    userResponse: string,
    userProfile: UserProfile
  ): Promise<AIResponse> {
    const context = this.buildEvaluationContext(question, userResponse, userProfile);
    
    const request: AIRequest = {
      type: 'evaluation',
      context,
      userProfile,
      sessionHistory: []
    };

    return this.processAIRequest(request);
  }

  // Generate comprehensive interview feedback
  public async generateInterviewFeedback(
    userProfile: UserProfile,
    sessionHistory: InterviewResponse[],
    questions: Question[]
  ): Promise<AIResponse> {
    const context = this.buildFeedbackContext(userProfile, sessionHistory, questions);
    
    const request: AIRequest = {
      type: 'feedback',
      context,
      userProfile,
      sessionHistory
    };

    return this.processAIRequest(request);
  }

  // Process AI requests based on provider
  private async processAIRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      let response: string;
      let tokensUsed = 0;

      if (this.currentProvider === 'openai') {
        const result = await this.callOpenAI(request);
        response = result.content;
        tokensUsed = result.tokensUsed;
      } else if (this.currentProvider === 'perplexity') {
        const result = await this.callPerplexity(request);
        response = result.content;
        tokensUsed = result.tokensUsed;
      } else {
        throw new Error('No AI provider available');
      }

      const processingTime = Date.now() - startTime;

      return {
        content: response,
        type: request.type,
        confidence: this.calculateConfidence(response),
        metadata: {
          tokensUsed,
          processingTime,
          model: this.currentProvider === 'openai' ? 'gpt-3.5-turbo' : 'sonar-medium-online'
        }
      };
    } catch (error) {
      console.error('AI request failed:', error);
      return this.generateFallbackResponse(request.type);
    }
  }

  // Call OpenAI API
  private async callOpenAI(request: AIRequest): Promise<{ content: string; tokensUsed: number }> {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found');
    }

    const systemPrompt = this.getSystemPrompt(request.type);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.context }
        ],
        max_tokens: this.getMaxTokens(request.type),
        temperature: this.getTemperature(request.type),
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    return { content, tokensUsed };
  }

  // Call Perplexity API
  private async callPerplexity(request: AIRequest): Promise<{ content: string; tokensUsed: number }> {
    const apiKey = process.env.REACT_APP_PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error('Perplexity API key not found');
    }

    const systemPrompt = this.getSystemPrompt(request.type);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-medium-online',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.context }
        ],
        max_tokens: this.getMaxTokens(request.type),
        temperature: this.getTemperature(request.type)
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    return { content, tokensUsed };
  }

  // Build context for question generation
  private buildQuestionContext(
    userProfile: UserProfile,
    questionHistory: InterviewResponse[],
    currentTopic?: string
  ): string {
    const recentResponses = questionHistory.slice(-5);
    const techStacksStr = userProfile.techStacks.join(', ');
    
    return `
Generate an interview question for a ${userProfile.experienceLevel} ${userProfile.role} position.

User Profile:
- Role: ${userProfile.role}
- Position: ${userProfile.position}
- Experience Level: ${userProfile.experienceLevel}
- Tech Stacks: ${techStacksStr}

${currentTopic ? `Current Topic: ${currentTopic}` : ''}

Recent Interview History:
${recentResponses.map((r, i) => `${i + 1}. Response: ${r.response.substring(0, 100)}...`).join('\n')}

Requirements:
- Generate a relevant technical question
- Match the difficulty to the user's experience level
- Avoid repeating similar questions from history
- Focus on practical scenarios and problem-solving
- Keep the question clear and specific

Please provide only the question without additional formatting.
    `.trim();
  }

  // Build context for follow-up questions
  private buildFollowUpContext(
    originalQuestion: Question,
    userResponse: string,
    userProfile: UserProfile
  ): string {
    return `
Original Question: ${originalQuestion.question}
User's Response: ${userResponse}

User Profile:
- Experience Level: ${userProfile.experienceLevel}
- Role: ${userProfile.role}

Based on the user's response, generate a relevant follow-up question that:
- Digs deeper into their understanding
- Tests practical application
- Explores edge cases or advanced concepts
- Matches their experience level

Provide only the follow-up question without additional formatting.
    `.trim();
  }

  // Build context for response evaluation
  private buildEvaluationContext(
    question: Question,
    userResponse: string,
    userProfile: UserProfile
  ): string {
    return `
Question: ${question.question}
Expected Answer: ${question.answer}
User's Response: ${userResponse}

User Profile:
- Experience Level: ${userProfile.experienceLevel}
- Role: ${userProfile.role}

Evaluate the user's response considering:
- Technical accuracy
- Completeness of the answer
- Understanding of concepts
- Practical application knowledge
- Communication clarity

Provide a score (1-10) and detailed feedback including:
- What they got right
- Areas for improvement
- Suggestions for further learning

Format: Score: X/10\nFeedback: [detailed feedback]
    `.trim();
  }

  // Build context for comprehensive feedback
  private buildFeedbackContext(
    userProfile: UserProfile,
    sessionHistory: InterviewResponse[],
    questions: Question[]
  ): string {
    const responsesSummary = sessionHistory.map((r, i) => 
      `Q${i + 1}: ${questions[i]?.question.substring(0, 50)}...\nA${i + 1}: ${r.response.substring(0, 100)}...`
    ).join('\n\n');

    return `
Interview Session Summary for ${userProfile.role} (${userProfile.experienceLevel} level)

Questions and Responses:
${responsesSummary}

Provide comprehensive feedback including:
1. Overall Performance Assessment (score out of 100)
2. Technical Strengths
3. Areas for Improvement
4. Specific Recommendations
5. Learning Resources
6. Next Steps for Career Development

Focus on constructive feedback that helps the candidate improve.
    `.trim();
  }

  // Get system prompts for different request types
  private getSystemPrompt(type: AIRequest['type']): string {
    const basePrompt = "You are an expert technical interviewer with extensive experience in software development and technical hiring.";
    
    switch (type) {
      case 'question':
        return `${basePrompt} Generate relevant, challenging interview questions that assess both theoretical knowledge and practical skills.`;
      
      case 'followup':
        return `${basePrompt} Create insightful follow-up questions that explore deeper understanding and practical application.`;
      
      case 'evaluation':
        return `${basePrompt} Provide fair, constructive evaluation of interview responses with actionable feedback.`;
      
      case 'feedback':
        return `${basePrompt} Deliver comprehensive interview feedback that helps candidates understand their performance and improve.`;
      
      default:
        return basePrompt;
    }
  }

  // Get max tokens based on request type
  private getMaxTokens(type: AIRequest['type']): number {
    switch (type) {
      case 'question':
      case 'followup':
        return 200;
      case 'evaluation':
        return 400;
      case 'feedback':
        return 800;
      default:
        return 300;
    }
  }

  // Get temperature based on request type
  private getTemperature(type: AIRequest['type']): number {
    switch (type) {
      case 'question':
      case 'followup':
        return 0.8; // More creative for question generation
      case 'evaluation':
      case 'feedback':
        return 0.3; // More consistent for evaluation
      default:
        return 0.5;
    }
  }

  // Calculate confidence score based on response
  private calculateConfidence(response: string): number {
    // Simple heuristic for confidence calculation
    const length = response.length;
    const hasSpecificTerms = /\b(specific|exactly|precisely|definitely)\b/i.test(response);
    const hasUncertainty = /\b(maybe|perhaps|might|could be|uncertain)\b/i.test(response);
    
    let confidence = 0.7; // Base confidence
    
    if (length > 100) confidence += 0.1;
    if (length > 300) confidence += 0.1;
    if (hasSpecificTerms) confidence += 0.1;
    if (hasUncertainty) confidence -= 0.2;
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  // Generate fallback responses when AI fails
  private generateFallbackResponse(type: AIRequest['type']): AIResponse {
    const fallbackContent = {
      question: "Can you explain your approach to solving complex technical problems?",
      followup: "Can you provide a specific example of how you've implemented this in a real project?",
      evaluation: "Score: 7/10\nFeedback: Your response shows good understanding. Consider providing more specific examples and technical details.",
      feedback: "Overall Performance: 75/100\nYou demonstrated solid technical knowledge. Focus on providing more detailed explanations and practical examples in future interviews."
    };

    return {
      content: fallbackContent[type],
      type,
      confidence: 0.5,
      metadata: {
        tokensUsed: 0,
        processingTime: 0,
        model: 'fallback'
      }
    };
  }

  // Check if AI services are available
  public isAvailable(): boolean {
    return !!(process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_PERPLEXITY_API_KEY);
  }

  // Get current provider status
  public getProviderStatus(): { provider: string; available: boolean } {
    if (this.currentProvider === 'openai') {
      return { provider: 'OpenAI', available: !!process.env.REACT_APP_OPENAI_API_KEY };
    } else {
      return { provider: 'Perplexity', available: !!process.env.REACT_APP_PERPLEXITY_API_KEY };
    }
  }

  // Test AI connection
  public async testConnection(): Promise<boolean> {
    try {
      const testRequest: AIRequest = {
        type: 'question',
        context: 'Generate a simple test question about JavaScript.',
        userProfile: {
          userId: 'test',
          role: 'Frontend Developer',
          position: 'Software Engineer',
          experienceLevel: 'junior',
          techStacks: ['JavaScript'],
          interviewPreferences: {
            duration: 60,
            difficulty: 'beginner',
            questionMode: 'random',
            questionsPerSet: 10,
            enableRecording: false,
            enableSpeech: false,
            enableCodeEditor: false
          }
        },
        sessionHistory: []
      };

      const response = await this.processAIRequest(testRequest);
      return response.content.length > 0;
    } catch (error) {
      console.error('AI connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
