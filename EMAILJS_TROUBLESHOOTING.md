# EmailJS Troubleshooting Guide

## Common Issues and Solutions

### 1. **Template Configuration Issues**

#### Check Your EmailJS Template:
1. Go to your EmailJS dashboard → Email Templates
2. Make sure your template uses these exact variable names:
   - `{{from_name}}` - sender's name
   - `{{from_email}}` - sender's email
   - `{{subject}}` - message subject
   - `{{message}}` - message content
   - `{{reply_to}}` - reply-to email

#### Recommended Template Content:
**Subject**: `New Portfolio Contact: {{subject}}`

**Body**:
```
Hello Siva,

You have received a new message from your portfolio website.

From: {{from_name}}
Email: {{from_email}}
Reply-To: {{reply_to}}
Subject: {{subject}}

Message:
{{message}}

---
Sent from your portfolio contact form
```

### 2. **Service Configuration Issues**

#### Check Your Email Service:
1. Go to EmailJS dashboard → Email Services
2. Make sure your service is **connected** and **active**
3. Test the connection by clicking "Test" in your service settings

### 3. **Email Delivery Issues**

#### Check These Common Problems:

1. **Spam Folder**: Check your spam/junk folder
2. **Email Filters**: Check if you have filters blocking emails
3. **Service Limits**: Check EmailJS dashboard for usage limits
4. **Template Status**: Make sure template is published/active
5. **Service Status**: Verify your email service is working

### 4. **Debug Steps**

#### Step 1: Open Browser Console
1. Go to your portfolio website
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Submit the contact form
5. Look for error messages

#### Step 2: Check EmailJS Dashboard
1. Go to EmailJS dashboard
2. Check "Usage" section for recent activity
3. Look for failed attempts or error logs

#### Step 3: Test Template Directly
1. In EmailJS dashboard, go to your template
2. Click "Test" button
3. Fill in sample data
4. Send test email to yourself

### 5. **Alternative Template Variables**

If issues persist, try this simplified template:

**Subject**: `Portfolio Contact`

**Body**:
```
Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

{{message}}
```

### 6. **Service-Specific Issues**

#### Gmail Service:
- Make sure 2FA is enabled
- Use App Password instead of regular password
- Check Gmail spam folder specifically

#### Outlook Service:
- Verify account permissions
- Check Outlook spam folder

### 7. **Rate Limiting**
- Free tier: 200 emails/month, 50/day
- Check if you've hit limits in dashboard

### 8. **Browser Console Errors to Look For**
- CORS errors
- Authentication failures
- Network timeouts
- Invalid template/service IDs

## Quick Test

Try this test in your browser console on your portfolio:

```javascript
// Test EmailJS directly
emailjs.send(
  'your_service_id',
  'your_template_id',
  {
    from_name: 'Test User',
    from_email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message content',
    reply_to: 'test@example.com'
  },
  'your_public_key'
).then(
  (result) => console.log('Success:', result),
  (error) => console.log('Error:', error)
);
```

Replace the IDs with your actual values and run this in the console.
