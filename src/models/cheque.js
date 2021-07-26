const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chequeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
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
    }
});

const Cheque = mongoose.model('Cheque', chequeSchema);

module.exports = Cheque;
