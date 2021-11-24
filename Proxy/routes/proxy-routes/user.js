const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware, adminMiddleware } = require('../proxy-controllers/auth');
const { getTags } = require('../proxy-controllers/tag');
const { read, publicProfile, update, photo, userSettings } = require('../proxy-controllers/user');

router.get('/user/profile', requireSignin, authMiddleware, getTags, read);
router.get('/user/settings', requireSignin, authMiddleware, userSettings);
router.get('/user/:username', publicProfile);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);

module.exports = router;
