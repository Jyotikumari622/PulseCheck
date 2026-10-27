const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['up', 'down'], required: true },
    statusCode: { type: Number, default: null },
    responseTime: { type: Number, default: null }, // ms
    checkedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const siteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    // Cached "current" state so we don't have to look at checks[] every time
    currentStatus: { type: String, enum: ['up', 'down', 'unknown'], default: 'unknown' },
    lastCheckedAt: { type: Date, default: null },
    checks: { type: [checkSchema], default: [] }, // capped list, most recent last
  },
  { timestamps: true }
);

// Uptime % based on stored checks
siteSchema.methods.getUptimePercentage = function () {
  if (this.checks.length === 0) return null;
  const upCount = this.checks.filter((c) => c.status === 'up').length;
  return Number(((upCount / this.checks.length) * 100).toFixed(2));
};

const MAX_CHECKS = 100;

siteSchema.methods.addCheck = function (checkData) {
  this.checks.push(checkData);
  if (this.checks.length > MAX_CHECKS) {
    this.checks.shift(); // drop oldest
  }
  this.currentStatus = checkData.status;
  this.lastCheckedAt = checkData.checkedAt;
};

module.exports = mongoose.model('Site', siteSchema);
