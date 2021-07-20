const mongoose = require('mongoose');

const Schema= mongoose.Schema;

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
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'deleted'],
        default: 'pending'
    }
});

const Cheque = mongoose.model('Cheque', chequeSchema);

module.exports = Cheque;
