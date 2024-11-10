const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const student = new Student({ name, email, password });
    await student.save();
    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (student && await student.comparePassword(password)) {
      const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
      res.cookie('token', token, { httpOnly: true });
      // Redirect to tasks page after successful login
      res.redirect('/tasks');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
