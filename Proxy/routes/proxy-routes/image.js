const express = require('express');
const router = express.Router();

const { uploadProfileImage, uploadPostImage, afterUpload, uploadImageURL, getImage, getProfilePhoto } = require('../proxy-controllers/image');
const { requireSignin, authMiddleware } = require('../proxy-controllers/auth');

router.post('/upload-profile-photo', requireSignin, authMiddleware, uploadProfileImage, afterUpload);

router.get('/get-profile-photo', requireSignin, authMiddleware, getProfilePhoto);

router.post('/upload', requireSignin, authMiddleware, uploadPostImage, afterUpload);
router.post('/upload-image-url', uploadImageURL);
router.get('/images/uploads/:file', getImage);

module.exports = router; 
