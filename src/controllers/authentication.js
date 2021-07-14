const validator = require('validator');
const otpGenerator = require('otp-generator');
const moment = require('moment');
const bcrypt = require('bcryptjs');


const User = require('../models/user');

const register = async (req, res) => {
    try {
        const {password, email, username, name, role} = req.body;
        if (!email || !name || !username || !username || !password)
            return res.status(400).json({data: null, token: null, message: 'missing required field'});
        if (!validator.isEmail(email)) {
            return res.status(400).json({data: null, token: null, message: 'invalid email or phone'});
        }
        const tryExistingUser = await User.findOne({$or: [{username, email}]});
        if (tryExistingUser) return res.status(409).json({data: null, token: null, message: 'user already exist'});

        const otp = otpGenerator.generate(6, {digits: true, alphabets: false, upperCase: false, specialChars: false});
        const otpValidUntil = moment().add(7, 'days');
        const user = await User.create({
            email,
            name,
            otp,
            otpValidUntil,
            role,
            password
        });
        const token = user.generateToken();
        res.status(201).json({
            data: user,
            token,
            message: `code has been sent to your account ${email}. Verify it to start your trial`
        });
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email) return res.status(400).json({
            data: null,
            token: null,
            message: 'missing email or phone field'
        });
        const existingUser = await User.findOne({email});
        if (!existingUser) return res.status(404).json({
            data: null,
            token: null,
            message: `no account associated with ${email}`
        });
        if (!existingUser.hasVerifiedEmailOrPhone) return res.status(401).json({
            data: null,
            token: null,
            message: `please verify your account`
        });
        if (existingUser.isBlocked) return res.status(400).json({
            data: null,
            token: null,
            message: `account associated with ${email} is suspended`
        });
        if (!password) return res.status(400).json({data: null, token: null, message: 'missing password field'});
        if (!await bcrypt.compare(password, existingUser.password)) return res.status(401).json({
            data: null,
            token: null,
            message: 'auth failed'
        });
        const token = existingUser.generateToken();
        res.status(200).json({data: existingUser, token, message: 'login successful'});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const verifyOTP = async (req, res) => {
    try {
        const {otp, password} = req.body;
        if (!otp || !password) return res.status(400).json({
            data: null,
            token: null,
            message: 'missing otp or password'
        });
        if (otp !== req.user.otp) return res.status(401).json({data: null, token: null, message: 'incorrect otp'});
        if (!validator.isStrongPassword(password)) return res.status(400).json({
            data: null,
            token: null,
            message: 'weak password'
        });
        if (!req.user.hasVerifiedEmailOrPhone && Date.now() > req.user.otpValidUntil.getTime())
            return res.status(400).json({data: null, token: null, message: 'otp expired. request for a new otp'});
        if (otp === req.user.otp && validator.isStrongPassword(password)) {
            req.user.hasVerifiedEmailOrPhone = true;
            req.user.otpVerifiedAt = new Date();
            req.user.password = await bcrypt.hash(password, 10);
        }
        console.log(3)
        const user = await req.user.save();
        res.status(200).json({data: user, message: 'account verified'});
    } catch (e) {
        console.log(4)
        res.status(400).json({message: `${e.message}`});
    }
}


const resendOTP = async (req, res) => {
    try {
        const {emailOrPhone} = req.body;
        if (!emailOrPhone) return res.status(400).json({success: false, data: null, message: 'missing email or phone'});
        const user = await User.findOne({emailOrPhone});
        if (!user) return res.status(404).json({success: false, data: null, message: 'user not found'});
        const otp = otpGenerator.generate(6, {digits: true, alphabets: false, upperCase: false, specialChars: false});
        const otpValidUntil = moment().add(7, 'days');
        user.otp = otp;
        user.otpValidUntil = otpValidUntil;
        user.hasVerifiedEmailOrPhone = false;
        const savedUser = await user.save();
        res.status(200).json({data: savedUser, message: 're-sent code to activate your account', success: true});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const updateProfile = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) return res.status(400).json({data: null, message: 'updates not allowed'});
        for (let key of updates) {
            req.user[key] = req.body[key];
        }
        const updatedUser = await req.user.save();
        res.status(200).json({data: updatedUser, message: 'profile updated'});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const getProfile = async (req, res) => {
    try {
        res.status(200).json({data: req.user, token: req.token, message: 'profile retrieved'});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const deactivateProfile = async (req, res) => {
    try {
        const {deactivateReason} = req.body;
        req.user.isDeactivated = true;
        req.user.dateDeactivated = new Date().toUTCString();
        req.user.deactivateReason = deactivateReason;
        await req.user.save();
        res.status(200).json({data: req.user, message: 'account deactivated', success: true});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const updatePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({data: null, message: 'missing required fields', success: false});
        if (!await bcrypt.compare(currentPassword, req.user.password))
            return res.status(401).json({data: null, message: 'incorrect password', success: false});
        if (!validator.isStrongPassword(newPassword))
            return res.status(400).json({data: null, message: 'weak password', success: false});
        req.user.password = await bcrypt.hash(newPassword, 10);
        const savedUser = await req.user.save();
        res.status(200).json({data: savedUser, message: 'password updated', success: true});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const reactivateProfile = async (req, res) => {
    try {

    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}

module.exports = {
    register,
    login,
    verifyOTP,
    resendOTP,
    getProfile,
    updateProfile,
    deactivateProfile,
    updatePassword,
    reactivateProfile
};
