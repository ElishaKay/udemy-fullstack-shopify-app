const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        shop: { 
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tag', tagSchema);
