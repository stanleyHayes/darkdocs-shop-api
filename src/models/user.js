const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`${value} is not a valid email`);
            }
        }
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    hasVerifiedEmail: {
        type: Boolean,
        default: false
    },
    otpValidUntil: {
        type: Date
    },
    otp: {
        type: String,
        maxLength: 6,
        minLength: 6
    },
    otpVerifiedAt: {
        type: Date
    },
    password: {
        required: true,
        type: String,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error(`${value} is a weak password. Follow the password requirement`)
            }
        }
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    dateBlocked: {
        type: Date
    },
    isDeactivated: {
        type: Boolean,
        default: false
    },
    dateDeactivated: {
        type: Date
    },
    deactivateReason: {
        type: String
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        default: 'USER'
    },
    balance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Deleted'],
        default: 'Active'
    }
}, {timestamps: {createdAt: true, updatedAt: true}});

userSchema.methods.generateToken = function () {
    return jwt.sign({
            _id: this._id.toString(),
            email: this.email,
            username: this.username
        }, process.env.JWT_SECRET,
        {expiresIn: '30d'})
}

const User = mongoose.model('User', userSchema);

module.exports = User;
