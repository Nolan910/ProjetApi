require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 
app.use(passport.initialize());

// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const announcementRoutes = require('./routes/announcements');
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
