const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite,
} = require('../controllers/siteController');

router.use(protect); // all routes below require login

router.route('/').get(getSites).post(createSite);
router.route('/:id').get(getSiteById).put(updateSite).delete(deleteSite);

module.exports = router;
