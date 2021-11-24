const Shop = require('../models/shop');
const Blog = require('../models/blog');
const Tag = require('../models/tag');
const User = require('../models/user');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { title, body, categories, tags } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }

        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, ' ', ' ...');
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160));
        blog.postedBy = req.user._id;
        console.log('req.user._id on server when saving blogpost: ',req.user._id);
        
        // categories and tags
        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            blog.photo.data = fs.readFileSync(files.photo.path);
            blog.photo.contentType = files.photo.type;
        }

        blog.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(result);
            Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        Blog.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
                            (err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler(err)
                                    });
                                } else {
                                    res.json(result);
                                }
                            }
                        );
                    }
                }
            );
        });
    });
};

// list, listAllBlogsCategoriesTags, read, remove, update

exports.listForSitemap = (req, res) => {
    Blog.find({})
        .select('slug updatedAt')
        .exec((err, blogs) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            
            User.find({})
                .select('username updatedAt')
                .exec((err, users) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }

                    Tag.find({})
                        .select('slug updatedAt')
                        .exec((err, tags) => {
                            if (err) {
                                return res.json({
                                    error: errorHandler(err)
                                });
                            }
                            let data = {};
                            
                            data.tags=tags; 
                            data.users=users;
                            data.blogs=blogs;

                            res.json(data);
                    });
            });        
        });
};

exports.list = (req, res) => {
    console.log('req.body in list function',req.body);
    let shopName = req.params.username ? req.params.username.toLowerCase() : '';

    Shop.find({shopify_domain: shopName})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .limit(9)
        .select('_id title slug excerpt categories tags postedBy hidden createdAt updatedAt')

        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({hidden: false, product_imgurl:{ $ne: null }})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ total_ratings: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug product_imgurl product_summary mdesc autoGenerated categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            blogs = data; // blogs
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; // categories
                // get all tags
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    tags = t;
                    // return all blogs categories tags
                    res.json({ blogs, categories, tags, size: blogs.length });
                });
            });
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({ slug })
        // .select("-photo")
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username trackingID')
        .select('_id title body search_keyword reviewsWithURLs product_reviews product_title product_by product_cost product_link product_imgurl product_rating total_ratings product_summary autoGenerated slug mtitle mdesc categories tags postedBy trackingID createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Blog deleted successfully'
        });
    });
};


exports.toggle = (req, res) => {
    console.log('req.user: ', req.user);
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({ slug: slug }, function(err, blog) {
        blog.hidden = !blog.hidden;
        blog.save(function(err, updatedBook) {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json({
                message: 'Blog toggled successfully'
            });
        });
    });
}


exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, desc, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldBlog.desc = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 1000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path);
                oldBlog.photo.contentType = files.photo.type;
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data);
        });
};

exports.listRelated = (req, res) => {
    console.log(req.body.blog);
    let limit = req.body.limit ? parseInt(req.body.limit) : 9;
    const { _id, tags, search_keyword } = req.body.blog;

    if(search_keyword){
        Blog.find({ _id: { $ne: _id }, hidden: false, search_keyword: search_keyword })
            .limit(limit)
            .populate('postedBy', '_id name username profile')
            .sort({ total_ratings: -1 })
            .select('title slug autoGenerated product_imgurl mdesc postedBy createdAt updatedAt')
            .exec((err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Blogs not found'
                    });
                }
                res.json(blogs);
            });
    } else {
        Blog.find({ _id: { $ne: _id }, hidden: false, tags: { $in: tags } })
            .limit(limit)
            .populate('postedBy', '_id name username profile')
            .select('title slug autoGenerated product_imgurl mdesc postedBy createdAt updatedAt')
            .exec((err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Blogs not found'
                    });
                }
                res.json(blogs);
            });
    }
};

//
exports.listSearch = (req, res) => {
    console.log(req.query);
    const { search } = req.query;
    let limit = req.body.limit ? parseInt(req.body.limit) : 35;

    if (search) {
        Blog.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }],
                hidden: false
            },
            (err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(blogs);
            }
        ).limit(limit)
        .sort({ total_ratings: -1 })
        .select('-photo -body');
    }
};

exports.listByUser = (req, res) => {
    // Shop.findOne({ username: req.params.username }).exec((err, user) => {
    console.log('req.body', req.body);
    let shopName = req.params.username ? req.params.username.toLowerCase() : '';
    console.log('shopName',shopName);
    Shop.findOne({shopify_domain: shopName}).exec((err, shop) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        console.log('shop in mongo response', shop);
        let shopId = shop._id;
        Blog.find({ shopPostedAt: shopId })
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug postedBy hidden createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                console.log('mongo response to fetching the results of the given store', data);
                res.json(data);
            });
    });
};
