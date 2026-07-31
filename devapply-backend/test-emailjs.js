const axios = require('axios');
require('dotenv').config();

async function testEmailJS() {
  console.log('=== TESTING EMAILJS API ===');
  console.log('Service ID:', process.env.EMAILJS_SERVICE_ID);
  console.log('Template ID:', process.env.EMAILJS_TEMPLATE_ID);
  console.log('Public Key:', process.env.EMAILJS_PUBLIC_KEY ? '✅ SET' : '❌ MISSING');
  console.log('Private Key:', process.env.EMAILJS_PRIVATE_KEY ? '✅ SET' : '❌ MISSING');
  console.log('----------------------------------------');
  
  const requestBody = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      email: 'ftmk9090@gmail.com',
      resetUrl: 'https://devapply-alpha.vercel.app/reset-password/test123',
      subject: 'Test Email from DevApply'
    }
  };
  
  console.log('Request Body:', JSON.stringify(requestBody, null, 2));
  console.log('----------------------------------------');
  
  try {
    const response = await axios.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testEmailJS();