// Configuration file for easy switching between environments
// Change these values when deploying to production

export const config = {
  // API Configuration
  api: {
    // For localhost testing
    baseUrl: 'http://localhost:3000',
    
    // For production (uncomment and update when deploying)
    // baseUrl: 'https://your-domain.vercel.app',
    
    endpoints: {
      chat: '/api/chat',
      add: '/api/add',
      health: '/api/health'
    }
  },

  // Database Configuration
  database: {
    // For localhost testing with MongoDB Compass
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot',
    
    // For production with MongoDB Atlas (set in environment variables)
    // uri: process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/chatbot?retryWrites=true&w=majority',
    
    name: 'chatbot'
  },

  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  }
};

// Helper function to get full API URL
export function getApiUrl(endpoint = '') {
  return `${config.api.baseUrl}${endpoint}`;
}

// Helper function to check if we're in development
export function isDevelopment() {
  return config.environment === 'development';
}

// Helper function to check if we're in production
export function isProduction() {
  return config.environment === 'production';
}

export default config;
