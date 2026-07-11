const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto'); // Use crypto instead of uuid


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

// FORGOT PASSWORD - WITH EMAIL SENDING
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('Password reset requested for:', email);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ 
        message: 'If an account exists with this email, you will receive a reset link.' 
      });
    }
    
    // Generate reset token using crypto
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    // Save to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://devapply-alpha.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    console.log('Reset URL generated for:', email);
    
    // Send email using Resend
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'DevApply <noreply@devapply.com>',
        to: [email],
        subject: 'Reset Your DevApply Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8b5cf6; font-size: 28px; margin: 0;">DevApply</h1>
              <p style="color: #94a3b8; font-size: 16px;">Job Application Tracker</p>
            </div>
            
            <div style="background-color: #1e293b; padding: 30px; border-radius: 8px;">
              <h2 style="color: #e2e8f0; margin-top: 0;">Reset Your Password</h2>
              <p style="color: #cbd5e1; line-height: 1.6;">
                You requested to reset your password. Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #94a3b8; font-size: 14px;">
                This link will expire in <strong style="color: #e2e8f0;">1 hour</strong>.
              </p>
              <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e293b;">
              <p style="color: #475569; font-size: 12px;">
                DevApply - Job Application Tracker
              </p>
            </div>
          </div>
        `,
      });
      
      console.log('✅ Reset email sent to:', email);
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't return error to user - they don't need to know email failed
    }
    
    res.json({ 
      message: 'If an account exists with this email, you will receive a reset link.' 
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// RESET PASSWORD - Verify token and set new password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
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

module.exports = router;