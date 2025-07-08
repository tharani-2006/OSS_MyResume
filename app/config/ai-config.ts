// AI Chatbot Configuration
// Updated with live API endpoint

export const AI_CONFIG = {
  // Local development
  LOCAL_API_URL: 'http://localhost:3001/api/chat/message',
  
  // Production API URL - LIVE ENDPOINT
  PRODUCTION_API_URL: 'https://premiere-brakes-attitudes-ohio.trycloudflare.com/api/chat/message',
  
  // API Key
  API_KEY: process.env.NEXT_PUBLIC_AI_API_KEY || 'ak_1751948233952_l9tap319gfn',
  
  // Determine which URL to use
  getApiUrl: () => {
    // If we're in production or the environment variable is set, use production URL
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_PRODUCTION_AI === 'true') {
      return process.env.NEXT_PUBLIC_AI_API_URL || AI_CONFIG.PRODUCTION_API_URL;
    }
    // Otherwise use local development URL
    return AI_CONFIG.LOCAL_API_URL;
  },
  
  // Health check endpoint
  getHealthUrl: () => {
    const baseUrl = AI_CONFIG.getApiUrl().replace('/api/chat/message', '');
    return `${baseUrl}/health`;
  }
};
