# EmailJS Debugging Checklist

## Immediate Actions (Do These First)

### 1. Test the Live Site
1. Go to your deployed site: https://your-site.vercel.app
2. Open browser console (F12 → Console)
3. Copy and paste the debug script from `debug-emailjs-step-by-step.js`
4. Run it and check the output

### 2. Check EmailJS Dashboard
1. Go to https://dashboard.emailjs.com
2. Click on "Email Templates" → Check your template
3. Click on "Email Services" → Check your service status
4. Click on "Integration" → Check your usage/limits

### 3. Test the Contact Form
1. Fill out the form on your site
2. Submit it
3. Check browser console for logs
4. Check EmailJS dashboard for sent emails

## Detailed Debugging Steps

### Step 1: Verify EmailJS Account Setup

**Check Your Email Service:**
- [ ] Service is connected and active
- [ ] Test connection works in EmailJS dashboard
- [ ] Service limits are not exceeded

**Check Your Email Template:**
- [ ] Template exists and is active
- [ ] Template uses correct variable names: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`, `{{reply_to}}`
- [ ] Template has a proper "To" email address (your email)

### Step 2: Verify Environment Variables

**On Vercel Dashboard:**
1. Go to your project settings
2. Check Environment Variables tab
3. Verify these are set:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### Step 3: Check Email Delivery

**Common Issues:**
- [ ] Check spam/junk folder
- [ ] Check email filters
- [ ] Check if your email provider is blocking emails
- [ ] Try using a different email address in your template

### Step 4: Test Different Scenarios

**Test 1: Direct EmailJS Test**
```javascript
// Run this in browser console on your site
emailjs.send('your_service_id', 'your_template_id', {
    from_name: 'Test User',
    from_email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message',
    reply_to: 'test@example.com'
}, 'your_public_key')
.then(response => console.log('Success:', response))
.catch(error => console.log('Error:', error));
```

**Test 2: Form Submission Test**
1. Fill out form with real data
2. Submit
3. Check browser console for logs
4. Check EmailJS dashboard for activity

### Step 5: Advanced Debugging

**If emails still don't arrive:**

1. **Check EmailJS Dashboard Activity:**
   - Go to Dashboard → Integration
   - Check for recent sends
   - Look for error messages

2. **Check Browser Network Tab:**
   - Open F12 → Network
   - Submit form
   - Look for emailjs API calls
   - Check response status

3. **Try Different Email Provider:**
   - Test with Gmail service instead of current service
   - Or try with a different email address

## Common Solutions

### Solution 1: Template Variable Mismatch
- Make sure template variables match exactly what the code sends
- Check for typos in variable names

### Solution 2: Service Configuration
- Ensure your email service is properly configured
- Test the service connection in EmailJS dashboard

### Solution 3: Email Delivery Issues
- Check spam folder
- Try different email address
- Check email provider settings

### Solution 4: Rate Limiting
- Check if you've hit EmailJS free tier limits
- Wait and try again later

## Next Steps

1. **Run the debug script** on your live site
2. **Check EmailJS dashboard** for any errors or activity
3. **Test the form** with real data
4. **Check email delivery** (spam folder, filters, etc.)

If you're still having issues after these steps, please share:
- Debug script output
- Browser console logs
- EmailJS dashboard status
- Any error messages you see
