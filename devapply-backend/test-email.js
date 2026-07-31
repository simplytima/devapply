const emailjs = require('emailjs-com');
require('dotenv').config();

async function testEmail() {
  try {
    const serviceID = process.env.EMAILJS_SERVICE_ID;
    const templateID = process.env.EMAILJS_TEMPLATE_ID;
    const userID = process.env.EMAILJS_PUBLIC_KEY;
    
    console.log('Service ID:', serviceID);
    console.log('Template ID:', templateID);
    console.log('User ID:', userID);
    
    const templateParams = {
      email: 'ftmk9090@gmail.com',
      resetUrl: 'https://devapply-alpha.vercel.app/reset-password/test123',
      subject: 'Test Email from DevApply'
    };
    
    const result = await emailjs.send(serviceID, templateID, templateParams, userID);
    console.log('✅ Test email sent successfully!');
    console.log('Response:', result);
  } catch (error) {
    console.error('❌ Test email failed:');
    console.error('Error:', error);
    console.error('Error text:', error.text || 'No error text');
  }
}

testEmail();