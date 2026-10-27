const Site = require('../models/Site');

// @route  GET /api/sites
// @desc   Get all sites belonging to logged-in user
const getSites = async (req, res) => {
  try {
    const sites = await Site.find({ user: req.user._id }).sort({ createdAt: -1 });

    const sitesWithUptime = sites.map((site) => ({
      _id: site._id,
      name: site.name,
      url: site.url,
      currentStatus: site.currentStatus,
      lastCheckedAt: site.lastCheckedAt,
      uptimePercentage: site.getUptimePercentage(),
      totalChecks: site.checks.length,
    }));

    res.json(sitesWithUptime);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  GET /api/sites/:id
// @desc   Get single site with full check history
const getSiteById = async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, user: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found' });

    res.json({
      _id: site._id,
      name: site.name,
      url: site.url,
      currentStatus: site.currentStatus,
      lastCheckedAt: site.lastCheckedAt,
      uptimePercentage: site.getUptimePercentage(),
      checks: site.checks,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  POST /api/sites
// @desc   Add a new site to monitor
const createSite = async (req, res) => {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({ message: 'Please provide name and url' });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ message: 'Please provide a valid URL (include https://)' });
    }

    const site = await Site.create({ user: req.user._id, name, url });
    res.status(201).json(site);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  PUT /api/sites/:id
// @desc   Update a site's name/url
const updateSite = async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, user: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found' });

    const { name, url } = req.body;
    if (name) site.name = name;
    if (url) site.url = url;

    await site.save();
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  DELETE /api/sites/:id
const deleteSite = async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found' });

    res.json({ message: 'Site removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getSites, getSiteById, createSite, updateSite, deleteSite };
