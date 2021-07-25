const User = require('../models/user');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const validator = require('validator');
const moment = require('moment');

const getUsers = async (req, res) => {
    try {
        const match = {};
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 10;
        const skip = (page - 1) * limit;

        if (req.query.role) {
            match['role'] = req.query.role;
        }
        const users = await User.find(match).limit(limit).skip(skip);
        res.status(200).json({data: users, count: users.length, message: `${users.length} users retrieved`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const getUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({data: null, message: `account with id ${userID} does not exist`});
        res.status(200).json({data: user, message: `user retrieved`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const blockUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({data: null, message: `account with id ${userID} does not exist`});
        user.isBlocked = true;
        user.dateBlocked = new Date().toUTCString();
        const savedUser = await user.save();
        res.status(200).json({data: savedUser, message: `account with id ${userID} suspended`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const unblockUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({data: null, message: `account with id ${userID} does not exist`});
        user.isBlocked = false;
        user.dateBlocked = undefined;
        const savedUser = await user.save();
        res.status(200).json({data: savedUser, message: `account with id ${userID} activated`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const updateUser = async (req, res) => {
    try {
        console.log(req.body);
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'password', 'role', 'status', 'username', 'email'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) return res.status(400).json({data: null, message: 'updates not allowed'});
        const user = await User.findById(req.params.userID);
        if (!user) return res.status(404).json({
            data: null,
            message: `${req.params.userID} account does not exist`,
            success: false
        });
        for (let key of updates) {
            if (key === 'password') {
                user.password = await bcrypt.hash(req.body.password, 10);
                continue;
            }
            user[key] = req.body[key];
        }
        const savedUser = await user.save();
        res.status(200).json({data: savedUser, message: 'user updated'});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const deactivateUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const {deactivateReason} = req.body;
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({
            data: null,
            success: false,
            message: `account with id ${userID} not found`
        });
        user.isDeactivated = true;
        user.dateDeactivated = new Date().toUTCString();
        user.deactivateReason = deactivateReason;
        const savedUser = await user.save();
        res.status(200).json({data: savedUser, message: `account with id ${userID} deactivated`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const reactivateUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({
            data: null,
            success: false,
            message: `account with id ${userID} not found`
        });
        user.isDeactivated = false;
        user.dateDeactivated = undefined;
        user.deactivateReason = undefined;
        const savedUser = await user.save();
        res.status(200).json({data: savedUser, message: `account with id ${userID} re-activated`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}

const createUser = async (req, res) => {
    try {
        const {password, email, username, name, role} = req.body;
        if (!email || !name || !username || !password)
            return res.status(400).json({data: null, token: null, message: 'missing required field'});

        if (!validator.isEmail(email)) {
            return res.status(400).json({data: null, token: null, message: 'invalid email or phone'});
        }
        const tryExistingUser = await User.findOne({$or: [{username, email}]});
        if (tryExistingUser) return res.status(409).json({data: null, token: null, message: 'user already exist'});

        const otp = otpGenerator.generate(6, {digits: true, alphabets: false, upperCase: false, specialChars: false});
        const otpValidUntil = moment().add(7, 'days');
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
            message: `otp code has been sent to the account ${email}.`
        });

    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}

const deleteUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({success: false, data: null, message: `user with id${userID} not found`});
        }
        user.status = 'Deleted';
        const savedUser = await user.save();
        res.status(200).json({success: true, data: savedUser, message: `user with id ${userID} deleted`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}

module.exports = {
    getUsers,
    getUser,
    deactivateUser,
    updateUser,
    blockUser,
    reactivateUser,
    unblockUser,
    createUser,
    deleteUser
};
