// Test EmailJS Configuration
// Run this in your browser console on your portfolio website to test EmailJS

// Check if EmailJS is configured
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

console.log('EmailJS Configuration:');
console.log('Service ID:', serviceId ? '✅ Configured' : '❌ Missing');
console.log('Template ID:', templateId ? '✅ Configured' : '❌ Missing');
console.log('Public Key:', publicKey ? '✅ Configured' : '❌ Missing');

if (serviceId && templateId && publicKey) {
  console.log('✅ EmailJS is properly configured!');
} else {
  console.log('❌ EmailJS needs configuration. Check your .env.local file.');
}

// Test function
window.testEmailJS = async function() {
  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: 'Test User',
        from_email: 'test@example.com',
        subject: 'Test Message from Portfolio',
        message: 'This is a test message to verify EmailJS is working correctly.',
        to_email: 'vsivareddy.venna@gmail.com',
      },
      publicKey
    );
    console.log('✅ Test email sent successfully!', result);
    alert('Test email sent successfully! Check your inbox.');
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    alert('Failed to send test email. Check console for details.');
  }
};

console.log('Run testEmailJS() to send a test email.');
