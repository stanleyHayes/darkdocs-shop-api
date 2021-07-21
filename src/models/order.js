const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const orderSchema = new Schema({
    user: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled', 'Deleted'],
        default: 'Pending'
    },
    type: {
        type: String,
        enum: ['Cheque', 'Dump', 'Login'],
        required: true
    },
    item: {
        cheque: {
            type: Schema.Types.ObjectId,
            ref: 'Cheque'
        },
        login: {
            type: Schema.Types.ObjectId,
            ref: 'Login'
        },
        ccDumps: {
            type: Schema.Types.ObjectId,
            ref: 'Dumps'
        },
    }
}, {timestamps: {createdAt: true, updatedAt: true}});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
