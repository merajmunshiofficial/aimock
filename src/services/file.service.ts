import { QuestionBank, MCQBank, Tutorial, Question, MCQ } from '../types';

// File Service class for managing question banks, MCQs, and tutorials
export class FileService {
  private static instance: FileService;
  private questionBanks: Map<string, QuestionBank> = new Map();
  private mcqBanks: Map<string, MCQBank> = new Map();
  private tutorials: Map<string, Tutorial> = new Map();

  private constructor() {
    this.initializeDefaultData();
  }

  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  // Initialize with default data
  private initializeDefaultData(): void {
    this.loadDefaultQuestionBanks();
    this.loadDefaultMCQBanks();
    this.loadDefaultTutorials();
  }

  // Load default question banks
  private loadDefaultQuestionBanks(): void {
    const defaultQuestionBanks = [
      {
        techStack: 'React',
        questions: [
          {
            id: 1,
            question: 'What is JSX and how does it work?',
            answer: 'JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets transpiled to React.createElement() calls by tools like Babel. JSX makes it easier to write and visualize the component structure.',
            difficulty: 'beginner' as const,
            category: 'concepts' as const,
            techStack: 'React',
            tags: ['jsx', 'syntax', 'babel']
          },
          {
            id: 2,
            question: 'Explain the difference between state and props in React.',
            answer: 'Props are read-only data passed from parent to child components, while state is mutable data managed within a component. Props are external inputs, state is internal data that can change over time and trigger re-renders.',
            difficulty: 'beginner' as const,
            category: 'concepts' as const,
            techStack: 'React',
            tags: ['state', 'props', 'components']
          },
          {
            id: 3,
            question: 'What are React Hooks and why were they introduced?',
            answer: 'React Hooks are functions that let you use state and other React features in functional components. They were introduced to eliminate the need for class components, provide better code reuse, and make components easier to understand and test.',
            difficulty: 'intermediate' as const,
            category: 'concepts' as const,
            techStack: 'React',
            tags: ['hooks', 'functional-components', 'useState', 'useEffect']
          },
          {
            id: 4,
            question: 'How would you optimize a React application for performance?',
            answer: 'Performance optimization techniques include: using React.memo for component memoization, implementing useMemo and useCallback for expensive calculations, code splitting with lazy loading, optimizing bundle size, using virtual scrolling for large lists, and avoiding unnecessary re-renders.',
            difficulty: 'advanced' as const,
            category: 'scenario' as const,
            techStack: 'React',
            tags: ['performance', 'optimization', 'memoization', 'code-splitting']
          }
        ],
        metadata: {
          totalQuestions: 4,
          lastUpdated: new Date().toISOString(),
          version: '1.0.0'
        }
      },
      {
        techStack: 'JavaScript',
        questions: [
          {
            id: 1,
            question: 'Explain closures in JavaScript with an example.',
            answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Example: function outer(x) { return function inner(y) { return x + y; }; } const add5 = outer(5); add5(3); // returns 8',
            difficulty: 'intermediate' as const,
            category: 'concepts' as const,
            techStack: 'JavaScript',
            tags: ['closures', 'scope', 'functions']
          },
          {
            id: 2,
            question: 'What is the event loop in JavaScript?',
            answer: 'The event loop is a mechanism that handles asynchronous operations in JavaScript. It continuously checks the call stack and task queue, moving tasks from the queue to the stack when the stack is empty. This enables non-blocking execution of asynchronous code.',
            difficulty: 'advanced' as const,
            category: 'concepts' as const,
            techStack: 'JavaScript',
            tags: ['event-loop', 'asynchronous', 'concurrency']
          },
          {
            id: 3,
            question: 'How would you implement a debounce function?',
            answer: 'function debounce(func, delay) { let timeoutId; return function(...args) { clearTimeout(timeoutId); timeoutId = setTimeout(() => func.apply(this, args), delay); }; }',
            difficulty: 'intermediate' as const,
            category: 'coding' as const,
            techStack: 'JavaScript',
            tags: ['debounce', 'performance', 'timing']
          }
        ],
        metadata: {
          totalQuestions: 3,
          lastUpdated: new Date().toISOString(),
          version: '1.0.0'
        }
      },
      {
        techStack: 'Node.js',
        questions: [
          {
            id: 1,
            question: 'What is the difference between process.nextTick() and setImmediate()?',
            answer: 'process.nextTick() executes callbacks before any other I/O events in the current phase, while setImmediate() executes callbacks in the next iteration of the event loop. nextTick has higher priority and can potentially starve I/O operations if used excessively.',
            difficulty: 'advanced' as const,
            category: 'concepts' as const,
            techStack: 'Node.js',
            tags: ['event-loop', 'asynchronous', 'timing']
          },
          {
            id: 2,
            question: 'How do you handle errors in Node.js applications?',
            answer: 'Error handling in Node.js involves: try-catch for synchronous code, error-first callbacks for asynchronous operations, Promise.catch() for promises, process.on("uncaughtException") for unhandled exceptions, and proper error middleware in Express applications.',
            difficulty: 'intermediate' as const,
            category: 'scenario' as const,
            techStack: 'Node.js',
            tags: ['error-handling', 'exceptions', 'middleware']
          }
        ],
        metadata: {
          totalQuestions: 2,
          lastUpdated: new Date().toISOString(),
          version: '1.0.0'
        }
      }
    ];

    defaultQuestionBanks.forEach(bank => {
      this.questionBanks.set(bank.techStack, bank);
    });
  }

  // Load default MCQ banks
  private loadDefaultMCQBanks(): void {
    const defaultMCQBanks = [
      {
        techStack: 'React',
        mcqs: [
          {
            id: 1,
            question: 'Which method is used to create a React component?',
            options: ['React.createComponent()', 'React.Component', 'function Component()', 'All of the above'],
            correctAnswer: 'All of the above',
            explanation: 'React components can be created using class components (extending React.Component) or functional components (using function syntax).',
            difficulty: 'beginner' as const,
            techStack: 'React',
            tags: ['components', 'creation']
          },
          {
            id: 2,
            question: 'What is the virtual DOM?',
            options: ['A copy of the real DOM', 'A JavaScript representation of the DOM', 'A faster version of the DOM', 'All of the above'],
            correctAnswer: 'A JavaScript representation of the DOM',
            explanation: 'The virtual DOM is a JavaScript representation of the actual DOM that React uses to optimize rendering performance.',
            difficulty: 'intermediate' as const,
            techStack: 'React',
            tags: ['virtual-dom', 'performance']
          }
        ],
        metadata: {
          totalMCQs: 2,
          lastUpdated: new Date().toISOString(),
          version: '1.0.0'
        }
      },
      {
        techStack: 'JavaScript',
        mcqs: [
          {
            id: 1,
            question: 'What is the output of: console.log(typeof null)?',
            options: ['null', 'undefined', 'object', 'boolean'],
            correctAnswer: 'object',
            explanation: 'This is a well-known JavaScript quirk. typeof null returns "object" due to a bug in the original JavaScript implementation that has been kept for backward compatibility.',
            difficulty: 'intermediate' as const,
            techStack: 'JavaScript',
            tags: ['typeof', 'null', 'quirks']
          },
          {
            id: 2,
            question: 'Which of the following is NOT a primitive data type in JavaScript?',
            options: ['string', 'number', 'array', 'boolean'],
            correctAnswer: 'array',
            explanation: 'Arrays are objects in JavaScript, not primitive data types. The primitive types are: string, number, boolean, null, undefined, symbol, and bigint.',
            difficulty: 'beginner' as const,
            techStack: 'JavaScript',
            tags: ['data-types', 'primitives']
          }
        ],
        metadata: {
          totalMCQs: 2,
          lastUpdated: new Date().toISOString(),
          version: '1.0.0'
        }
      }
    ];

    defaultMCQBanks.forEach(bank => {
      this.mcqBanks.set(bank.techStack, bank);
    });
  }

  // Load default tutorials
  private loadDefaultTutorials(): void {
    const defaultTutorials = [
      {
        id: 'react-basics',
        title: 'React Fundamentals',
        techStack: 'React',
        content: `# React Fundamentals

## Introduction
React is a JavaScript library for building user interfaces, particularly web applications. It was developed by Facebook and is now maintained by Meta and the open-source community.

## Key Concepts

### Components
Components are the building blocks of React applications. They can be either functional or class-based.

\`\`\`jsx
// Functional Component
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Class Component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
\`\`\`

### JSX
JSX is a syntax extension that allows you to write HTML-like code in JavaScript.

\`\`\`jsx
const element = <h1>Hello, World!</h1>;
\`\`\`

### Props
Props are read-only properties passed to components.

\`\`\`jsx
function Greeting({ name, age }) {
  return <p>Hello {name}, you are {age} years old!</p>;
}
\`\`\`

### State
State is mutable data that belongs to a component.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Best Practices
1. Keep components small and focused
2. Use functional components with hooks
3. Follow naming conventions
4. Optimize for performance when needed
`,
        difficulty: 'beginner' as const,
        estimatedReadTime: 15,
        tags: ['react', 'components', 'jsx', 'props', 'state'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'javascript-advanced',
        title: 'Advanced JavaScript Concepts',
        techStack: 'JavaScript',
        content: `# Advanced JavaScript Concepts

## Closures
Closures are functions that have access to variables in their outer scope.

\`\`\`javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

## Prototypes and Inheritance
JavaScript uses prototypal inheritance.

\`\`\`javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`;
};

const john = new Person('John');
console.log(john.greet()); // Hello, I'm John
\`\`\`

## Async/Await
Modern way to handle asynchronous operations.

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Event Loop
Understanding how JavaScript handles asynchronous operations.

The event loop continuously checks:
1. Call Stack
2. Microtask Queue (Promises)
3. Macrotask Queue (setTimeout, setInterval)
`,
        difficulty: 'advanced' as const,
        estimatedReadTime: 25,
        tags: ['javascript', 'closures', 'prototypes', 'async', 'event-loop'],
        lastUpdated: new Date().toISOString()
      }
    ];

    defaultTutorials.forEach(tutorial => {
      this.tutorials.set(tutorial.id, tutorial);
    });
  }

  // Get all question banks
  public getAllQuestionBanks(): QuestionBank[] {
    return Array.from(this.questionBanks.values());
  }

  // Get question bank by tech stack
  public getQuestionBank(techStack: string): QuestionBank | null {
    return this.questionBanks.get(techStack) || null;
  }

  // Get questions by tech stack and filters
  public getQuestions(
    techStack: string,
    filters?: {
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
      category?: 'concepts' | 'coding' | 'scenario';
      tags?: string[];
    }
  ): Question[] {
    const bank = this.getQuestionBank(techStack);
    if (!bank) return [];

    let questions = bank.questions;

    if (filters) {
      if (filters.difficulty) {
        questions = questions.filter(q => q.difficulty === filters.difficulty);
      }
      if (filters.category) {
        questions = questions.filter(q => q.category === filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        questions = questions.filter(q => 
          q.tags?.some(tag => filters.tags!.includes(tag))
        );
      }
    }

    return questions;
  }

  // Get random questions
  public getRandomQuestions(
    techStacks: string[],
    count: number,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): Question[] {
    const allQuestions: Question[] = [];

    techStacks.forEach(techStack => {
      const questions = this.getQuestions(techStack, { difficulty });
      allQuestions.push(...questions);
    });

    // Shuffle and return requested count
    const shuffled = this.shuffleArray([...allQuestions]);
    return shuffled.slice(0, count);
  }

  // Get all MCQ banks
  public getAllMCQBanks(): MCQBank[] {
    return Array.from(this.mcqBanks.values());
  }

  // Get MCQ bank by tech stack
  public getMCQBank(techStack: string): MCQBank | null {
    return this.mcqBanks.get(techStack) || null;
  }

  // Get MCQs by tech stack and filters
  public getMCQs(
    techStack: string,
    filters?: {
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
      tags?: string[];
    }
  ): MCQ[] {
    const bank = this.getMCQBank(techStack);
    if (!bank) return [];

    let mcqs = bank.mcqs;

    if (filters) {
      if (filters.difficulty) {
        mcqs = mcqs.filter(m => m.difficulty === filters.difficulty);
      }
      if (filters.tags && filters.tags.length > 0) {
        mcqs = mcqs.filter(m => 
          m.tags?.some(tag => filters.tags!.includes(tag))
        );
      }
    }

    return mcqs;
  }

  // Get random MCQs
  public getRandomMCQs(
    techStacks: string[],
    count: number,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): MCQ[] {
    const allMCQs: MCQ[] = [];

    techStacks.forEach(techStack => {
      const mcqs = this.getMCQs(techStack, { difficulty });
      allMCQs.push(...mcqs);
    });

    const shuffled = this.shuffleArray([...allMCQs]);
    return shuffled.slice(0, count);
  }

  // Get all tutorials
  public getAllTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values());
  }

  // Get tutorials by tech stack
  public getTutorialsByTechStack(techStack: string): Tutorial[] {
    return Array.from(this.tutorials.values()).filter(
      tutorial => tutorial.techStack === techStack
    );
  }

  // Get tutorial by ID
  public getTutorial(id: string): Tutorial | null {
    return this.tutorials.get(id) || null;
  }

  // Search across all content
  public search(query: string): {
    questions: Question[];
    mcqs: MCQ[];
    tutorials: Tutorial[];
  } {
    const lowerQuery = query.toLowerCase();
    
    const questions = this.getAllQuestionBanks()
      .flatMap(bank => bank.questions)
      .filter(q => 
        q.question.toLowerCase().includes(lowerQuery) ||
        q.answer.toLowerCase().includes(lowerQuery) ||
        q.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );

    const mcqs = this.getAllMCQBanks()
      .flatMap(bank => bank.mcqs)
      .filter(m => 
        m.question.toLowerCase().includes(lowerQuery) ||
        m.explanation.toLowerCase().includes(lowerQuery) ||
        m.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );

    const tutorials = this.getAllTutorials()
      .filter(t => 
        t.title.toLowerCase().includes(lowerQuery) ||
        t.content.toLowerCase().includes(lowerQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );

    return { questions, mcqs, tutorials };
  }

  // Get available tech stacks
  public getAvailableTechStacks(): string[] {
    const questionTechStacks = Array.from(this.questionBanks.keys());
    const mcqTechStacks = Array.from(this.mcqBanks.keys());
    const tutorialTechStacks = Array.from(new Set(this.getAllTutorials().map(t => t.techStack)));

    return Array.from(new Set([...questionTechStacks, ...mcqTechStacks, ...tutorialTechStacks]));
  }

  // Get statistics
  public getStatistics(): {
    totalQuestions: number;
    totalMCQs: number;
    totalTutorials: number;
    techStacks: number;
    questionsByDifficulty: Record<string, number>;
    mcqsByDifficulty: Record<string, number>;
  } {
    const allQuestions = this.getAllQuestionBanks().flatMap(bank => bank.questions);
    const allMCQs = this.getAllMCQBanks().flatMap(bank => bank.mcqs);
    const allTutorials = this.getAllTutorials();

    const questionsByDifficulty = this.groupByDifficulty(allQuestions);
    const mcqsByDifficulty = this.groupByDifficulty(allMCQs);

    return {
      totalQuestions: allQuestions.length,
      totalMCQs: allMCQs.length,
      totalTutorials: allTutorials.length,
      techStacks: this.getAvailableTechStacks().length,
      questionsByDifficulty,
      mcqsByDifficulty
    };
  }

  // Add new question bank
  public addQuestionBank(bank: QuestionBank): void {
    this.questionBanks.set(bank.techStack, bank);
    this.saveToLocalStorage();
  }

  // Add new MCQ bank
  public addMCQBank(bank: MCQBank): void {
    this.mcqBanks.set(bank.techStack, bank);
    this.saveToLocalStorage();
  }

  // Add new tutorial
  public addTutorial(tutorial: Tutorial): void {
    this.tutorials.set(tutorial.id, tutorial);
    this.saveToLocalStorage();
  }

  // Update question bank
  public updateQuestionBank(techStack: string, bank: QuestionBank): void {
    if (this.questionBanks.has(techStack)) {
      this.questionBanks.set(techStack, bank);
      this.saveToLocalStorage();
    }
  }

  // Delete question bank
  public deleteQuestionBank(techStack: string): void {
    this.questionBanks.delete(techStack);
    this.saveToLocalStorage();
  }

  // Utility methods
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private groupByDifficulty<T extends { difficulty: string }>(items: T[]): Record<string, number> {
    return items.reduce((acc, item) => {
      acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Save to localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('questionBanks', JSON.stringify(Array.from(this.questionBanks.entries())));
      localStorage.setItem('mcqBanks', JSON.stringify(Array.from(this.mcqBanks.entries())));
      localStorage.setItem('tutorials', JSON.stringify(Array.from(this.tutorials.entries())));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Load from localStorage
  private loadFromLocalStorage(): void {
    try {
      const questionBanks = localStorage.getItem('questionBanks');
      const mcqBanks = localStorage.getItem('mcqBanks');
      const tutorials = localStorage.getItem('tutorials');

      if (questionBanks) {
        this.questionBanks = new Map(JSON.parse(questionBanks));
      }
      if (mcqBanks) {
        this.mcqBanks = new Map(JSON.parse(mcqBanks));
      }
      if (tutorials) {
        this.tutorials = new Map(JSON.parse(tutorials));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  // Export data
  public exportData(): {
    questionBanks: QuestionBank[];
    mcqBanks: MCQBank[];
    tutorials: Tutorial[];
  } {
    return {
      questionBanks: this.getAllQuestionBanks(),
      mcqBanks: this.getAllMCQBanks(),
      tutorials: this.getAllTutorials()
    };
  }

  // Import data
  public importData(data: {
    questionBanks?: QuestionBank[];
    mcqBanks?: MCQBank[];
    tutorials?: Tutorial[];
  }): void {
    if (data.questionBanks) {
      data.questionBanks.forEach(bank => this.addQuestionBank(bank));
    }
    if (data.mcqBanks) {
      data.mcqBanks.forEach(bank => this.addMCQBank(bank));
    }
    if (data.tutorials) {
      data.tutorials.forEach(tutorial => this.addTutorial(tutorial));
    }
  }

  // Reset to defaults
  public resetToDefaults(): void {
    this.questionBanks.clear();
    this.mcqBanks.clear();
    this.tutorials.clear();
    this.initializeDefaultData();
    this.saveToLocalStorage();
  }
}

// Export singleton instance
export const fileService = FileService.getInstance();
