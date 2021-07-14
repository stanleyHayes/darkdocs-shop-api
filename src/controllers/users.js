const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const match = {};
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 10;
        const skip = (page - 1) * limit;
        const users = await User.find(match).limit(limit).skip(skip);
        res.status(200).json({data: users, count: users.length});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const getUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const user = await User.findById(userID);
        if(!user) return res.status(404).json({data: null, message: `account with id ${userID} does not exist`});
        res.status(200).json({data: user, message: `user retrieved`});
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}


const blockUser = async (req, res) => {
    try {
        const {userID} = req.params;
        const user = await User.findById(userID);
        if(!user) return res.status(404).json({data: null, message: `account with id ${userID} does not exist`});
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
        if(!user) return res.status(404).json({data: null, message: `account with id ${userID} does not exist`});
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
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'password'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) return res.status(400).json({data: null, message: 'updates not allowed'});
        const user = await User.findOne({emailOrPhone: req.params.emailOrPhone});
        if(!user) return res.status(404).json({data: null, message: `${req.params.emailOrPhone} account does not exist`});
        for(let key of updates){
            if(key === 'password'){
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
        if(!user) return res.status(404).json({data: null, success: false, message:`account with id ${userID} not found` });
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
        if(!user) return res.status(404).json({data: null, success: false, message:`account with id ${userID} not found` });
        user.isDeactivated = false;
        user.dateDeactivated = undefined;
        user.deactivateReason = undefined;
        const savedUser = await user.save();
        res.status(200).json({data: savedUser, message: `account with id ${userID} re-activated`});
    }catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}



module.exports = {getUsers, getUser, deactivateUser, updateUser, blockUser, reactivateUser, unblockUser};
