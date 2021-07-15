const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bankSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
}, {timestamps: {createdAt: true, updatedAt: true}});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
