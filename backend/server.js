require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startPingJob } = require('./jobs/pingJob');

const authRoutes = require('./routes/authRoutes');
const siteRoutes = require('./routes/siteRoutes');
const pingRoutes = require('./routes/pingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/ping-check', pingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Uptime Monitor API is running' });
});

// Start the internal cron scheduler (works while the server is awake;
// see README for the free-tier hosting caveat)
startPingJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
