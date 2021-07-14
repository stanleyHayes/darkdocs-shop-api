const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const orderSchema = new Schema({
    user: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId
    }
}, {timestamps: {createdAt: true, updatedAt: true}});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
