const express = require('express');
const router = express.Router();
const { runAllChecks } = require('../jobs/pingJob');

// @route  GET /api/ping-check
// @desc   Manually trigger a check cycle. Meant to be hit by an external
//         scheduler (e.g. cron-job.org) so checks run reliably even if
//         Render's free tier has spun the server down and node-cron's
//         internal timer wasn't running.
router.get('/', async (req, res) => {
  try {
    await runAllChecks();
    res.json({ message: 'Health check cycle triggered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Ping check failed', error: err.message });
  }
});

module.exports = router;
