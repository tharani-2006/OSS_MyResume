// EmailJS Debug Script - Step by Step
// Run this in your browser console on your deployed site

console.log('=== EmailJS Debug Session ===');

// Step 1: Check if EmailJS is loaded
console.log('1. Checking if EmailJS is loaded...');
if (typeof emailjs !== 'undefined') {
    console.log('✅ EmailJS is loaded');
} else {
    console.log('❌ EmailJS is not loaded');
}

// Step 2: Check environment variables
console.log('2. Checking environment variables...');
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

console.log('Service ID:', serviceId ? '✅ Set' : '❌ Missing');
console.log('Template ID:', templateId ? '✅ Set' : '❌ Missing');
console.log('Public Key:', publicKey ? '✅ Set' : '❌ Missing');

// Step 3: Test EmailJS configuration
console.log('3. Testing EmailJS configuration...');
if (serviceId && templateId && publicKey) {
    console.log('All variables are set, testing EmailJS...');
    
    // Test data
    const testData = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message from the debug script.',
        reply_to: 'test@example.com'
    };
    
    // Send test email
    emailjs.send(serviceId, templateId, testData, publicKey)
        .then(function(response) {
            console.log('✅ EmailJS Test SUCCESS:', response);
            console.log('Status:', response.status);
            console.log('Text:', response.text);
        })
        .catch(function(error) {
            console.log('❌ EmailJS Test FAILED:', error);
            console.log('Error type:', error.name);
            console.log('Error message:', error.message);
            console.log('Error stack:', error.stack);
        });
} else {
    console.log('❌ Cannot test EmailJS - missing configuration');
}

// Step 4: Check network connectivity
console.log('4. Checking network connectivity to EmailJS...');
fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'OPTIONS'
})
.then(response => {
    console.log('✅ Network connection to EmailJS API is working');
})
.catch(error => {
    console.log('❌ Network connection to EmailJS API failed:', error);
});

// Step 5: Manual form test
console.log('5. To test the form manually, run this:');
console.log(`
// Fill out the form and click submit, then check:
// - Browser console for any errors
// - Network tab for API calls
// - EmailJS dashboard for sent emails
`);

console.log('=== Debug Session Complete ===');
console.log('If you see any errors above, check the troubleshooting guide.');
