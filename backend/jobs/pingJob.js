const cron = require('node-cron');
const axios = require('axios');
const Site = require('../models/Site');
const User = require('../models/User');
const { sendStatusAlert } = require('./mailer');

const TIMEOUT_MS = 8000;

const checkOneSite = async (site) => {
  const start = Date.now();
  const previousStatus = site.currentStatus; // status BEFORE this check

  let checkData;

  try {
    const response = await axios.get(site.url, {
      timeout: TIMEOUT_MS,
      validateStatus: () => true, // don't throw on non-2xx, we handle status ourselves
    });

    const responseTime = Date.now() - start;
    const isUp = response.status >= 200 && response.status < 400;

    checkData = {
      status: isUp ? 'up' : 'down',
      statusCode: response.status,
      responseTime,
      checkedAt: new Date(),
    };
  } catch (err) {
    // Network error, timeout, DNS failure, etc.
    checkData = {
      status: 'down',
      statusCode: null,
      responseTime: null,
      checkedAt: new Date(),
    };
  }

  site.addCheck(checkData);
  await site.save();

  // Only alert if status actually CHANGED (up->down or down->up)
  // Skip alert on the very first check ever (previousStatus === 'unknown')
  const statusChanged = previousStatus !== 'unknown' && previousStatus !== checkData.status;
console.log(
  `[DEBUG] Site: ${site.name} | Previous: ${previousStatus} | New: ${checkData.status} | Changed: ${statusChanged}`
);
  if (statusChanged) {
    try {
      const owner = await User.findById(site.user);
      if (owner) {
        await sendStatusAlert({
          to: owner.email,
          siteName: site.name,
          siteUrl: site.url,
          newStatus: checkData.status,
        });
      }
    } catch (err) {
      console.error('Alert lookup/send failed:', err.message);
    }
  }
};

const runAllChecks = async () => {
  const sites = await Site.find();
  console.log(`[cron] Running health checks for ${sites.length} site(s)...`);

  // Run checks in parallel but don't let one failure kill the batch
  await Promise.allSettled(sites.map((site) => checkOneSite(site)));

  console.log('[cron] Health check cycle complete.');
};

const startPingJob = () => {
  // Every 5 minutes — see README for why not every 1 min on free hosting
  cron.schedule('*/5 * * * *', runAllChecks);
  console.log('Ping cron job scheduled: every 5 minutes');
};

module.exports = { startPingJob, runAllChecks };
