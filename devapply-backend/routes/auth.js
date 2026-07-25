const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto');

// Import emailjs-com correctly
const emailjs = require('emailjs-com');

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

// FORGOT PASSWORD - FIXED VERSION
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('Password reset requested for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ 
        message: 'If an account exists with this email, you will receive a reset link.' 
      });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://devapply-alpha.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    console.log('Reset URL generated:', resetUrl);
    
    // Send email using emailjs-com
    try {
      const serviceID = process.env.EMAILJS_SERVICE_ID;
      const templateID = process.env.EMAILJS_TEMPLATE_ID;
      const userID = process.env.EMAILJS_PUBLIC_KEY;
      
      const templateParams = {
        email: email,
        resetUrl: resetUrl,
        subject: 'Reset Your DevApply Password'
      };
      
      console.log('Sending email with:', { serviceID, templateID, userID });
      
      // Use emailjs.send() correctly
      const result = await emailjs.send(serviceID, templateID, templateParams, userID);
      
      console.log('✅ Reset email sent to:', email);
      console.log('EmailJS response:', result);
      
    } catch (emailError) {
      console.error('❌ Email sending failed:');
      console.error('Error:', emailError);
      console.error('Error text:', emailError.text || 'No error text');
    }
    
    res.json({ 
      message: 'If an account exists with this email, you will receive a reset link.' 
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
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