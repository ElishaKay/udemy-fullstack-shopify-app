const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true,
            index: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        storeFavorites:  {
            type: String,
            default: 'The Products 😌'
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true
        },
        profile: {
            type: String,
            required: true
        },
        hashed_password: {
            type: String,
            required: false
        },
        salt: String,
        about: {
            type: String,
            default: ''
        },
        role: {
            type: Number,
            default: 0
        },
        cover_photo: {
            type: String
        },
        resetPasswordLink: {
            data: String,
            default: ''
        },
        popUser: { 
            type: Boolean, 
            default: false 
        },
        shops: [{ 
            type: ObjectId, 
            ref: 'Shop'
        }],
    },
    { timestamps: true }
);

userSchema
    .virtual('password')
    .set(function(password) {
        // create a temporarity variable called _password
        this._password = password;
        // generate salt
        this.salt = this.makeSalt();
        // encryptPassword
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = mongoose.model('User', userSchema);
