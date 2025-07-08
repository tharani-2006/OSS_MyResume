# AI Chatbot Live API Configuration

## 🚀 Setting Up Your Live AI API

Since your AiProject is now online with API access, follow these steps to connect it to your portfolio:

### Step 1: Update the API Configuration

1. **Update the production URL** in `/app/config/ai-config.ts`:
   ```typescript
   // Replace this with your actual live API URL
   PRODUCTION_API_URL: 'https://your-actual-ai-service-url.com/api/chat/message',
   ```

2. **Common deployment platforms and their URL patterns**:
   - **Railway**: `https://your-service-name.railway.app/api/chat/message`
   - **Vercel**: `https://your-project.vercel.app/api/chat/message`
   - **Heroku**: `https://your-app-name.herokuapp.com/api/chat/message`
   - **Render**: `https://your-service.onrender.com/api/chat/message`

### Step 2: Set Environment Variables

1. **For local development with live API**:
   ```bash
   # In your .env file
   NEXT_PUBLIC_AI_API_URL=https://your-live-api-url.com/api/chat/message
   NEXT_PUBLIC_AI_API_KEY=your-api-key
   NEXT_PUBLIC_USE_PRODUCTION_AI=true
   ```

2. **For production deployment**:
   Set these environment variables in your hosting platform:
   - `NEXT_PUBLIC_AI_API_URL`
   - `NEXT_PUBLIC_AI_API_KEY`

### Step 3: Update Projects.tsx with Live Demo Link

Once your AI service is deployed, update the project entry:

```typescript
{
  id: 1,
  title: 'AI Chatbot Microservice',
  description: '...',
  // Update this with your live API URL
  live: 'https://your-live-ai-service-url.com',
  // ...
}
```

### Step 4: Test the Integration

1. **Start your portfolio**:
   ```bash
   npm run dev
   ```

2. **Test the chatbot**:
   - Look for the green "AI Enhanced" status indicator
   - Try asking questions and verify you get AI-powered responses
   - If you see "Smart Fallback Mode", the AI service might be offline

### Step 5: Deployment Checklist

- [ ] AI service is deployed and accessible
- [ ] API endpoint URL is updated in config
- [ ] Environment variables are set
- [ ] Health check endpoint is working
- [ ] CORS is configured for your portfolio domain
- [ ] API key authentication is working

## 🔧 Current Configuration Status

The ChatBot component now includes:

✅ **Environment variable support**
✅ **Health check functionality**
✅ **Online/offline status indicator**
✅ **Smart fallback responses**
✅ **Enhanced error handling**
✅ **Automatic retry logic**

## 🎯 Features

### Visual Indicators
- **Green dot + "AI Enhanced"**: Live AI service is connected
- **Gray dot + "Smart Fallback Mode"**: Using fallback responses

### Smart Fallback System
Even when the AI service is offline, the chatbot provides intelligent responses about:
- Your experience and background
- Your projects and portfolio
- Your technical skills
- Contact information
- Information about the AI chatbot itself

### Health Monitoring
- Checks AI service health on component mount
- Periodic health checks every 30 seconds when chat is open
- Graceful degradation when service is unavailable

## 🚨 Troubleshooting

### Common Issues

1. **CORS Error**:
   - Ensure your AI service allows requests from your portfolio domain
   - Check CORS configuration in your AiProject

2. **API Key Issues**:
   - Verify the API key is correct
   - Check if your AI service requires specific authentication headers

3. **Network Issues**:
   - Ensure your AI service is publicly accessible
   - Check if there are any firewall restrictions

4. **Health Check Fails**:
   - Verify the health endpoint exists at `/api/chat/health`
   - Check if it returns a successful response

### Debug Mode
Check the browser console for detailed error messages and connection status.

## 📝 Next Steps

1. **Deploy your AI service** to a production environment
2. **Update the configuration** with your live API URL
3. **Test the integration** thoroughly
4. **Deploy your portfolio** with the live AI connection
5. **Monitor performance** and user engagement

Your AI chatbot is now ready to provide an enhanced, interactive experience for your portfolio visitors!
