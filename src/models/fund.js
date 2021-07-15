const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;
const fundSchema = new Schema({
    user: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled', 'Confirmed'],
        default: 'Pending'
    },
    address: {
        type: String,
        validate: function (value) {
            if(!validator.isBtcAddress(value)){
                throw new Error(`Invalid BTC Address ${value}`);
            }
        }
    }
}, {timestamps: {createdAt: true, updatedAt: true}});

const Fund = mongoose.model('Fund', fundSchema);

module.exports = Fund;
