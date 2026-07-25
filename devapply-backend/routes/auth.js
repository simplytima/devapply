const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto');
const axios = require('axios');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff`;
    
    const user = new User({ name, email, password: hashedPassword, avatar });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// FORGOT PASSWORD - WITH DETAILED LOGGING
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('=== FORGOT PASSWORD STARTED ===');
    console.log('1. Email received:', email);
    
    if (!email) {
      console.log('2. No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('2. Looking for user...');
    const user = await User.findOne({ email });
    console.log('3. User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('4. User not found, sending generic message');
      return res.json({ 
        message: 'If an account exists with this email, you will receive a reset link.' 
      });
    }
    
    console.log('4. Generating reset token...');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    console.log('5. Reset token saved to database');
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://devapply-alpha.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    console.log('6. Reset URL generated:', resetUrl);
    
    // Check environment variables
    console.log('7. Checking environment variables:');
    console.log('   EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY ? '✅ EXISTS' : '❌ MISSING');
    console.log('   EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID ? '✅ EXISTS' : '❌ MISSING');
    console.log('   EMAILJS_TEMPLATE_ID:', process.env.EMAILJS_TEMPLATE_ID ? '✅ EXISTS' : '❌ MISSING');
    
    // Send email using EmailJS REST API
    console.log('8. Attempting to send email...');
    try {
      const requestBody = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          email: email,
          resetUrl: resetUrl,
          subject: 'Reset Your DevApply Password'
        }
      };
      
      console.log('9. Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', requestBody);
      
      console.log('10. ✅ Email sent successfully!');
      console.log('    Response:', response.data);
      
    } catch (emailError) {
      console.error('11. ❌ Email sending failed:');
      console.error('    Error message:', emailError.message);
      if (emailError.response) {
        console.error('    Response status:', emailError.response.status);
        console.error('    Response data:', emailError.response.data);
      }
      // Don't fail the request - user doesn't need to know email failed
    }
    
    console.log('12. Sending response to user');
    console.log('=== FORGOT PASSWORD ENDED ===');
    
    res.json({ 
      message: 'If an account exists with this email, you will receive a reset link.' 
    });
    
  } catch (error) {
    console.error('=== FORGOT PASSWORD ERROR ===');
    console.error('Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user.password = hashedPassword;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null;
    await user.save();
    
    console.log('Password reset successfully for:', user.email);
    res.json({ message: 'Password has been reset successfully. You can now login.' });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;