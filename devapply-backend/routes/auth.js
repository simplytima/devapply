const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Add these imports at the top
const { Resend } = require('resend');
const { v4: uuidv4 } = require('uuid');

// Initialize Resend (add your API key to .env)
const resend = new Resend(process.env.RESEND_API_KEY);

// Forgot Password - Request reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('Password reset requested for:', email);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal that user doesn't exist
      return res.json({ message: 'If an account exists, you will receive a reset email.' });
    }
    
    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiration
    
    // Save to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    // Send email
    await resend.emails.send({
      from: 'DevApply <noreply@devapply.com>',
      to: [email],
      subject: 'Reset Your DevApply Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #a855f7); padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">DevApply</h1>
          </div>
          <div style="background: #0f172a; padding: 30px; border-radius: 0 0 12px 12px; color: #e2e8f0;">
            <h2 style="color: white; margin-top: 0;">Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
            <p>This link will expire in <strong>1 hour</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border-color: #1e293b; margin: 20px 0;">
            <p style="font-size: 12px; color: #64748b;">DevApply - Job Application Tracker</p>
          </div>
        </div>
      `,
    });
    
    console.log('Reset email sent to:', email);
    res.json({ message: 'If an account exists, you will receive a reset email.' });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset Password - Verify token and set new password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update password and clear reset fields
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

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt for:', email);
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create avatar URL
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff`;
    
    // Create user with hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    
    await user.save();
    
    console.log('User created successfully:', email);
    
    // Create token
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful for:', email);
    
    // Create token
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

module.exports = router;