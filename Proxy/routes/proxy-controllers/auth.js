const User = require('../../models/user');
const Blog = require('../../models/blog');
const Shop = require('../../models/Shop');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const md5 = require('md5');
// sendgrid
const sgMail = require('@sendgrid/mail'); // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '30d' });

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account activation link`,
            html: `
            <p>Please use the following link to activate your acccount:</p>
            <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://myamazonhistory.com</p>
        `
        };

        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account.
                            If you don't find the email in your Primary Inbox, please check your Spam Box.`
            });
        });
    });
};

// exports.signup = (req, res) => {
//     // console.log(req.body);
//     User.findOne({ email: req.body.email }).exec((err, user) => {
//         if (user) {
//             return res.status(400).json({
//                 error: 'Email is taken'
//             });
//         }

//         const { name, email, password } = req.body;
//         let username = shortId.generate();
//         let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//         let newUser = new User({ name, email, password, profile, username });
//         newUser.save((err, success) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             // res.json({
//             //     user: success
//             // });
//             res.json({
//                 message: 'Signup success! Please signin.'
//             });
//         });
//     });
// };

exports.signup = (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                });
            }

            const { name, email, password } = jwt.decode(token);

            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;

            const user = new User({ name, email, password, profile, username });
            user.save((err, user) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                return res.json({
                    message: 'Signup success! Please signin'
                });
            });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again'
        });
    }
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, { expiresIn: '1d' });
        const { _id, username, name, email, role } = user;
        return res.json({
            token,
            user: { _id, username, name, email, role }
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.requireSignin = (req, res, next) => {
    let expected_hash = md5(req.query.email+'somecrazyhash');
    console.log('expected_hash',expected_hash);
    console.log('actual_hash',req.query.hash);
    if(expected_hash == req.query.hash){
        next();
    } else {
        res.json({
            message: 'You must be logged in to view this route'
        })
    }   
}



// expressJwt({
//     secret: process.env.JWT_SECRET // req.user
// });

exports.authMiddleware = (req, res, next) => {
    let email = req.query.email.toLowerCase();
    if(email==''){
        return res.redirect(`https://${req.query.shop}/account/login`);
    }
    
    const authUserId = req.user ? req.user._id : 'no user yet';
    User.findOne({ email: email }).exec((err, user) => {
        if (err){
            console.log('ran error logic');
            return res.status(401).json({
                error: errorHandler(err)
            });
        } else if (!user){
            console.log('ran no user found logic');
            let name = req.query.name;
            let username = email.split('@')[0];
            let password = req.query.hash;
            let shop = req.query.shop;
            let profile = `https://${req.query.shop}/apps/tribe/user/${username}`;

            const user = new User({ name, email, password, profile, username });
            user.save((err, user) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                console.log('user created successfully');
                req.profile = user;
                //add shop to user record
                Shop.findOne({ shopify_domain: req.query.shop}).exec((err, shop) => {
                   User.findByIdAndUpdate(user._id, { $push: { shops: [shop._id] } }, { new: true }).exec(
                        (err, result) => {
                            if (err) {
                                // return res.status(400).json({
                                //     error: errorHandler(err)
                            }
                            console.log('Shop added to user record'); 
                        }
                    );        
                });
            });
        } else {
            console.log('user found')
            req.user = user;
        }
        req.profile = user;
        next();
    });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    console.log('req.profile in authMiddleware func: ',req.profile)
    console.log('req.body in authMiddleware func: ',req.body)
    // const adminUserId = req.profile._id;

    User.findById({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            });
        }

        req.profile = user;
        next();
    });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();
        if (!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            });
        }
        next();
    });
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist'
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '30d' });

        // email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password reset link`,
            html: `
            <p>Please use the following link to reset your password:</p>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://myamazonhistory.com</p>
        `
        };
        // populating the db > user > resetPasswordLink
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ error: errorHandler(err) });
            } else {
                sgMail.send(emailData).then(sent => {
                    return res.json({
                        message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
                    });
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Try again'
                });
            }
            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong. Try later'
                    });
                }
                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
};