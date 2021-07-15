const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;
const orderSchema = new Schema({
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
        enum: ['Pending', 'Completed', 'Cancelled', 'Deleted'],
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

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
