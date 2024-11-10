const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const Student = require('../models/Student');

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.redirect('/auth/login');
      }
      req.student = await Student.findById(decoded.id);
      next();
    });
  } else {
    res.redirect('/auth/login');
  }
};

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ student: req.student._id });
    res.render('tasks', { tasks, student: req.student });
  } catch (error) {
    next(error);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = new Task({ title, description, student: req.student._id });
    await task.save();
    res.redirect('/tasks');
  } catch (error) {
    next(error);
  }
});

router.post('/edit/:id', async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, description, status });
    res.redirect('/tasks');
  } catch (error) {
    next(error);
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
