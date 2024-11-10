// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.token || '';
  if (!token) {
    return res.status(401).redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).redirect('/auth/login');
  }
};

module.exports = { authenticate };
