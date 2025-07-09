# Contact Form Setup Guide

Your portfolio contact form now has multiple fallback methods to ensure it always works. Here's how to set up each option:

## Current Status
✅ **Mailto Fallback**: Always works - opens user's email client
✅ **Form Validation**: Client and server-side validation
✅ **Error Handling**: Graceful fallbacks with user feedback

## Setup Options (Choose One or More)

### Option 1: Formspree (Recommended - Free & Easy)

1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account
3. Create a new form
4. Copy your form endpoint URL
5. Add to your environment variables:
   ```bash
   # Add to .env.local
   FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
   ```

### Option 2: EmailJS (Client-side)

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up and create a service
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Update the EmailJS section in Contact.tsx:
   ```javascript
   const serviceId = 'your_service_id'
   const templateId = 'your_template_id' 
   const publicKey = 'your_public_key'
   ```
6. Uncomment the EmailJS code block

### Option 3: SMTP with Nodemailer (Server-side)

1. Add environment variables:
   ```bash
   # Add to .env.local
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password  # Use app password for Gmail
   ```
2. Uncomment the Nodemailer section in `/app/api/contact/route.ts`
3. Install nodemailer:
   ```bash
   npm install nodemailer @types/nodemailer
   ```

## Current Behavior

**Without Setup**: The form will use the mailto fallback, which opens the user's default email client with a pre-filled email.

**With Setup**: Messages will be sent directly through your chosen service, and you'll receive them in your inbox.

## Testing

1. Fill out the contact form on your website
2. If configured services fail, it will automatically fall back to mailto
3. Check your email for messages (if services are configured)

## Security Notes

- Never commit API keys or passwords to Git
- Use environment variables for all sensitive data
- Consider rate limiting for production use
- The current implementation includes basic validation and sanitization
