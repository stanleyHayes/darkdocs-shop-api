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
        }
    },
    email: {
        type: String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`Invalid Email Address ${value}`);
            }
        }
    }
});

const App = mongoose.model('App', appSchema);

module.exports = App;
