const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    status: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    includes: {
        type: [String],
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    bank: {
        type: Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    }
}, {timestamps: {createdAt: true, updatedAt: true}});

const Login = mongoose.model('Login', loginSchema);
