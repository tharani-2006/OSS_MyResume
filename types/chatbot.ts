// TypeScript interfaces for the chatbot API

export interface QADocument {
  _id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  question: string;
  limit?: number;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  question: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  matchedQuestion: string | null;
  alternatives: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
  suggestions?: string[];
}

export interface AddQARequest {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}

export interface AddQAResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    question: string;
    answer: string;
    category: string;
    tags: string[];
    createdAt: Date;
  };
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database: {
    connected: boolean;
    qaCount?: number;
    hasData?: boolean;
  };
  api: {
    chat: string;
    add: string;
    health: string;
  };
  version: string;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: string[];
}

// Mongoose model interface extensions
export interface QAModelStatics {
  searchQuestions: (query: string, limit?: number) => Promise<QADocument[]>;
  regexSearch: (query: string, limit?: number) => Promise<QADocument[]>;
}

export interface QAModelMethods {
  findSimilar: () => Promise<QADocument[]>;
}
