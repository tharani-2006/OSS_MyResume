# EmailJS Setup Instructions

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. Go to "Email Services" in your EmailJS dashboard
2. Click "Add New Service"
3. Choose "Gmail" (or your preferred email provider)
4. Follow the instructions to connect your email account
5. **Copy your Service ID** (you'll need this)

## Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Template Name**: `portfolio_contact`

**Subject**: `New Portfolio Contact: {{subject}}`

**Content**:
```
Hello Siva,

You have received a new message from your portfolio website.

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. **Copy your Template ID** (you'll need this)

## Step 4: Get Public Key
1. Go to "Account" -> "General"
2. Find your **Public Key** (you'll need this)

## Step 5: Update Environment Variables
Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the values with your actual EmailJS credentials.

## Step 6: Test Your Setup
1. Your contact form is already configured to use EmailJS
2. Fill out the form on your website
3. Check your email for the message
4. If it works, you'll receive emails directly in your inbox!

## Free Tier Limits
- 200 emails per month
- 50 emails per day
- Perfect for a portfolio website

## Security Notes
- Public key is safe to expose (it's meant to be public)
- Service and Template IDs are also safe to expose
- Never expose private keys or passwords
