const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth')

router.use(authenticate);

router.get('/', (req, res) => {
  res.render('tools', { student: req.student });
});

router.post('/resume', (req, res, next) => {
  try {
    const { name, email, experience } = req.body;
    res.send(`<h1>${name}'s Resume</h1><p>Email: ${email}</p><p>Experience: ${experience}</p>`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
