const express = require('express');
const router = express.Router();

// controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { create, list, read, remove } = require('../controllers/tag');

// validators
const { runValidation } = require('../validators');
const { createTagValidator } = require('../validators/tag');

// only difference is methods not name 'get' | 'post' | 'delete'
router.post('/tag', create);
router.get('/tags', list);
router.post('/blogs-of-given-tag', read);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);

module.exports = router; 
