const router = require('express').Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');

// Get all applications for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new application
router.post('/', authMiddleware, async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      user: req.user.id,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update application
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete application
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;