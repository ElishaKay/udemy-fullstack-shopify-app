const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const PurchaseHistorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        body: {
            type: {},
            required: true,
            min: 200,
            max: 2000000
        },
        excerpt: {
            type: String,
            max: 1000
        },
        mtitle: {
            type: String
        },
        mdesc: {
            type: String
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        hidden: { 
            type: Boolean, 
            default: false 
        },
        product_by: {
            type: String
        },
        product_cost: {
            type: String
        },
        product_link: {
            type: String
        },
        product_imgurl: {
            type: String
        },
        purchase_year: {
            type: Number
        },
        purchase_rating: {
            type: Number
        },
        main_format: {
            type: String
        },
        asin: {
            type: String
        },
        product_summary: {
            type: String
        }, 
        purchase_review: {
            type: String
        }, 
        categories: [{ 
            type: ObjectId, 
            ref: 'Category'
        }],
        tags: [{ 
            type: ObjectId, 
            ref: 'Tag'
        }],
        purchasedBy: {
            type: ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

PurchaseHistorySchema.index({ _id: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseHistory', PurchaseHistorySchema);
