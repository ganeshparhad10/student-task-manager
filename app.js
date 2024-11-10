require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser'); // Add this line
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const toolRoutes = require('./routes/tools');
const { authenticate } = require('./middleware/auth');

const app = express();

// Middleware setup
app.use(cookieParser()); // Add this line before other middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route handlers
app.use('/auth', authRoutes);
app.use('/tasks', authenticate, taskRoutes);
app.use('/tools', authenticate, toolRoutes);

// Root URL route
app.get('/', (req, res) => {
  res.render('index'); // Renders the index.ejs view
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
