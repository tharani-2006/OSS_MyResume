# EmailJS Debugging Guide

## Current Status
- Your contact form is now configured to use EmailJS as the PRIMARY method
- All environment variables are set on Vercel
- The latest deployment includes extensive logging and error handling

## Testing Steps

### 1. Test the Live Contact Form
1. Go to your production site: https://my-resume-2gti1z0wi-sivavennas-projects.vercel.app
2. Navigate to the Contact section
3. Fill out the form with your details
4. Submit the form
5. Open browser console (F12) to see debug output

### 2. Check EmailJS Configuration
The form will log the following in the console:
- Whether all environment variables are set
- The template data being sent
- Success/error responses from EmailJS

### 3. Debug with Test File
I've created a debug test file at `/debug-emailjs.html` that you can use to test EmailJS directly:

1. Open the file in your browser
2. Click "Test EmailJS" button
3. Check the console for detailed logs

### 4. Troubleshooting Common Issues

#### If EmailJS says "SUCCESS" but you don't receive emails:

1. **Check EmailJS Dashboard**
   - Go to https://dashboard.emailjs.com
   - Check the "Sent" section for your service
   - Verify emails are being sent

2. **Check Spam/Junk Folder**
   - EmailJS emails often end up in spam
   - Check your spam folder for test emails

3. **Verify Email Template**
   - In EmailJS dashboard, go to Email Templates
   - Make sure your template ID matches: `template_1jf6crg`
   - Test the template in the EmailJS dashboard

4. **Check Service Configuration**
   - Verify your service ID matches: `service_w6oxwdj`
   - Make sure the service is connected to your email provider

#### If EmailJS returns errors:

1. **Check Public Key**
   - Verify it matches: `ZRXH7r1GZlKFJTfCH`
   - Make sure it's set in Vercel environment variables

2. **Check CORS/Domain Settings**
   - In EmailJS dashboard, check if your domain is whitelisted
   - Make sure vercel.app domains are allowed

3. **Check API Limits**
   - EmailJS has rate limits (200 emails/month on free plan)
   - Check if you've exceeded limits

### 5. Console Debugging
When you test the form, you should see logs like:
```
Form submitted with data: {...}
EmailJS Configuration: {serviceId: 'Set', templateId: 'Set', publicKey: 'Set'}
Attempting to send email via EmailJS...
Template data: {...}
EmailJS Success: {status: 200, text: 'OK'}
```

### 6. What to Do Next

1. **Test the form on the live site**
2. **Check the browser console for any errors**
3. **Check your email (including spam folder)**
4. **Let me know what you see in the console logs**

## Current Configuration
- Service ID: `service_w6oxwdj`
- Template ID: `template_1jf6crg`
- Public Key: `ZRXH7r1GZlKFJTfCH`
- Destination Email: `vsivareddy.venna@gmail.com`

## Next Steps
1. Test the form and check console logs
2. If you see "EmailJS Success" but no email, check spam folder
3. If you see errors, share the console output with me
4. We can then debug further based on the specific error messages

The form is now properly configured to use EmailJS first, with comprehensive error handling and logging to help us identify any issues.
