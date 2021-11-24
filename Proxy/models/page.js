const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const pageSchema = new mongoose.Schema(
    {
        purchaseYear: {
            type: Number
        },
        yearlyPageNumber: {
            type: Number
        },
        multiPageYear: {
            type: Boolean,
            default: false   
        },
        totalPagesOfYear: {
            type: Number
        },
        searchKeyword:{
            type: String
        },
        totalSearchPages: {
            type: Number  
        },
        searchPageNumber: {
            type: Number  
        },
        belongsTo: { 
            type: ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);
