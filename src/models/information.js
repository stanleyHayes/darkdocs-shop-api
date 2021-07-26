const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const appSchema = new Schema({
    btcAddress: {
        type: String,
        validate(value){
            if(!validator.isBtcAddress(value)){
                throw new Error(`Invalid BTC Address ${value}`);
            }
        },
        required: true
    },
    email: {
        type: String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`Invalid Email Address ${value}`);
            }
        },
        required: true
    }
});

const Information = mongoose.model('Information', appSchema);

module.exports = Information;
