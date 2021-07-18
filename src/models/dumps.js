const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ccDumpSchema = new Schema({
    service: {
        type: String,
        required: true
    },
    bin: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    countryMark: {
        type: String,
        required: true
    },
    dumpedIn: {
        type: String,
        required: true
    },
    bankBase: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Deleted', 'Unavailable'],
        default: 'Active'
    }

}, {timestamps: {createdAt: true, updatedAt: true}});

const CCDump = mongoose.model('CCDump', ccDumpSchema);

module.exports = CCDump;
