/**
 * ./routes/proxy.js
 * This is where you'll set up anything to do with your app proxy if you have one set up.
 */

const express = require('express');
const { testTemplate } = require('./liquid-templates/testTemplate');
const router = express.Router();

//proxy routes
const blogRoutes = require('./proxy-routes/blog');
const authRoutes = require('./proxy-routes/auth');
const userRoutes = require('./proxy-routes/user');
const tagRoutes = require('./proxy-routes/tag');
const imageRoutes = require('./proxy-routes/image');

// Send everything from this route back as liquid.
router.use((req, res, next) => {
  res.set('Content-Type', 'application/liquid');
  return next();
});

//proxy middleware
router.use(blogRoutes);
router.use(authRoutes);
router.use(userRoutes);
router.use(tagRoutes);
router.use(imageRoutes);

router.get('/', (req, res, next) => {
    console.log(req.body);
  	return res.send(testTemplate(req.query));
  // res.sendStatus(200);
  next();
});

module.exports = router;
