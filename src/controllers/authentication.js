const validator = require('validator');
const otpGenerator = require('otp-generator');
const moment = require('moment');
const bcrypt = require('bcryptjs');


const User = require('../models/user');

const register = async (req, res) => {
    try {
        const {password, email, username, name, role} = req.body;
        if (!email || !name || !username || !password)
            return res.status(400).json({data: null, token: null, message: 'missing required field'});

        if (!validator.isEmail(email)) {
            return res.status(400).json({data: null, token: null, message: 'invalid email or phone'});
        }
        const tryExistingUser = await User.findOne({email});
        if (tryExistingUser) return res.status(409).json({data: null, token: null, message: `account already exist`});

        const otp = otpGenerator.generate(6, {digits: true, alphabets: false, upperCase: false, specialChars: false});
        const otpValidUntil = moment().add(14, 'days');
        const user = new User({
            email,
            name,
            otp,
            otpValidUntil,
            role,
            password: await bcrypt.hash(password, 10),
            username
        });
        const savedUser = await user.save();
        const token = user.generateToken();
        res.status(201).json({
            data: savedUser,
            token,
            message: `code has been sent to your account ${email}. Verify it to start your trial`,
            success: true
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
        if (!existingUser.hasVerifiedEmail) return res.status(401).json({
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
        const {otp} = req.body;
        if (!otp) return res.status(400).json({
            data: null,
            token: null,
            message: 'missing otp or password'
        });
        if (otp !== req.user.otp) return res.status(401).json({data: null, token: null, message: 'incorrect otp'});
        if (!req.user.hasVerifiedEmail && Date.now() > req.user.otpValidUntil.getTime())
            return res.status(400).json({data: null, token: null, message: 'otp expired. request for a new otp'});
        if (otp === req.user.otp) {
            req.user.hasVerifiedEmail = true;
            req.user.otpVerifiedAt = new Date();
        }
        const user = await req.user.save();
        res.status(200).json({data: user, message: 'account verified'});
    } catch (e) {
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
        const allowedUpdates = ['name', 'username', 'email', 'postalCode', 'city', 'country'];
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

const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        console.log(email);
        const user = await User.findOne({email});
        console.log(user);
        if (!user)
            return res.status(404).json({
                success: false,
                message: `no user associated with email ${email}`,
                data: null
            });
        user.otp = otpGenerator.generate(6, {digits: true, alphabets: false, upperCase: false, specialChars: false});
        user.otpValidUntil = moment().add(7, 'days');
        user.otpVerifiedAt = undefined;
        await user.save();
        res.status(200).json({message: `OTP has been sent to you email ${email}`, success: true, data: user});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const resetPassword = async (req, res) => {
    try {
        const {email, otp, newPassword} = req.body;
        const user = await User.findOne({email});
        if (!user)
            return res.status(404).json({
                message: `No user associated with email ${email}`,
                success: false,
                data: null
            });
        if (moment().isAfter(user.otpValidUntil))
            return res.status(401).json({message: `OTP expired. Generate a new otp`, success: false, data: null});
        if (user.otp !== otp)
            return res.status(401).json({message: `Incorrect otp`, success: false, data: null});
        user.otp = otp;
        user.otpVerifiedAt = Date.now();
        if (!validator.isStrongPassword(newPassword))
            return res.status(400).json({
                message: `Password too weak. Choose a strong password`,
                success: false,
                data: null
            });
        user.password = await bcrypt.hash(newPassword, 10);
        const savedUser = await user.save();
        res.status(200).json({success: true, message: `Password  successfully reset`, data: savedUser});
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
    reactivateProfile,
    forgotPassword,
    resetPassword
};
