const express = require('express');
const router = express.Router();
const {
    create,
    list,
    listForSitemap,
    listAllBlogsCategoriesTags,
    read,
    remove,
    toggle,
    update,
    photo,
    listRelated,
    listSearch,
    listByUser
} = require('../controllers/blog');

const { isValidShopifyRequest, requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');

router.get('/urls-for-sitemap', listForSitemap);

router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);


router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);

// auth user blog crud
router.post('/user/blog', requireSignin, authMiddleware, create);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);
router.put('/user/blog/toggle/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, toggle);

//
//Actually Being Used in Shopify Admin App
//

router.delete('/blog/:slug', remove);
router.put('/blog/toggle/:slug', toggle);
router.get('/:username/blogs', listByUser);

//for BlogUpdate Component
router.get('/blog/:slug', read);

module.exports = router;
