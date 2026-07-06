const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// REGISTER - Working
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt for:', email);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff`;
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    
    await user.save();
    
    console.log('User created successfully:', email);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// LOGIN - Working
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful for:', email);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// FORGOT PASSWORD - Detailed Error Logging
router.post('/forgot-password', async (req, res) => {
  try {
    console.log('1. Forgot password request received');
    const { email } = req.body;
    console.log('2. Email:', email);
    
    if (!email) {
      console.log('3. No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('4. Searching for user...');
    const user = await User.findOne({ email });
    console.log('5. User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.json({ message: 'If an account exists, you will receive a reset email.' });
    }
    
    console.log('6. Generating reset token...');
    const { v4: uuidv4 } = require('uuid');
    const resetToken = uuidv4();
    console.log('7. Token generated:', resetToken);
    
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    console.log('8. Saving to database...');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    console.log('9. User saved');
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://devapply-alpha.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    console.log('10. Reset URL created:', resetUrl);
    
    res.json({ 
      message: 'If an account exists, you will receive a reset email.',
      resetUrl: resetUrl
    });
    
  } catch (error) {
    console.error('Detailed forgot password error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
});

module.exports = router;