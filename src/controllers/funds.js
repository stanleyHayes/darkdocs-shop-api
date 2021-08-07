const Fund = require('../models/fund');
const User = require('../models/user');

exports.createFund = async (req, res) => {
    try {
        const {address, amount} = req.body;
        const fund = await Fund.create({user: req.user, address, amount});
        await fund.populate({path: 'user'}).execPopulate();
        res.status(201).json({data: fund, message: 'Fund successfully created', success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getFund = async (req, res) => {
    try {
        const {id} = req.params;
        const fund = await Fund.findById(id).populate({path: 'user'});
        if (!fund) {
            return res.status(404).json({success: false, message: `Fund with id ${id} not found`, data: null});
        }
        res.status(200).json({data: fund, message: 'Fund successfully retrieved', success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getFunds = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 20;
        const skip = (page - 1) * limit;
        const match = {};
        if (req.query.user) {
            match['user'] = req.query.user;
        }
        if (req.query.status) {
            match['status'] = req.query.status;
        }
        const fundsCount = await Fund.find(match).countDocuments();
        const funds = await Fund.find(match).populate({path: 'user'}).skip(skip).limit(limit);
        res.status(200).json({
            fundsCount,
            data: funds,
            message: `${funds.length} funds retrieved successfully`,
            success: true
        });
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateFund = async (req, res) => {
    try {
        const {id} = req.params;
        const fund = await Fund.findById(id).populate({path: 'user'});
        if (!fund) {
            return res.status(404).json({success: false, message: `Fund with id ${id} not found`, data: null});
        }
        const updates = Object.keys(req.body);
        const allowedUpdates = ['status', 'amount'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed)
            return res.status(400).json({success: false, message: `Update not allowed`, data: null});
        for (let key of updates) {
            fund[key] = req.body[key];
        }
        if (fund.status === 'Completed') {
            const user = await User.findById(fund.user);
            user.balance += parseFloat(fund.amount);
            await user.save();
        }
        const updatedFund = await fund.save();
        res.status(200).json({data: updatedFund, message: `Fund with id ${id} successfully updated`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.deleteFund = async (req, res) => {
    try {
        const {id} = req.params;
        const fund = await Fund.findById(id).populate({path: 'user'});
        if (!fund) {
            return res.status(404).json({success: false, message: `Fund with id ${id} not found`, data: null});
        }
        fund.status = 'Deleted';
        const updatedFund = await fund.save();
        res.status(200).json({data: updatedFund, message: `Fund with id ${id} successfully deleted`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
