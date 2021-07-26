const Login = require('../models/login');

exports.createLogin = async (req, res) => {
    try {
        const {status, type, includes, balance, price, country, bank} = req.body;
        const login = await Login.create({status, type, includes, balance, price, country, bank});
        await login.populate({path: 'bank'}).execPopulate();
        res.status(201).json({success: true, data: login, message: 'Bank successfully created'});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getLogin = async (req, res) => {
    try {
        const {id} = req.params;
        const login = await Login.findById(id).populate({path: 'bank'});
        if (!login)
            return res.status(404).json({success: false, message: `Bank Login with id ${id} not found`, data: null});
        res.status(200).json({success: true, data: login, message: `Bank Login with id ${id} retrieved`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateLogin = async (req, res) => {
    try {
        const {id} = req.params;
        const login = await Login.findById(id).populate({path: 'bank'});
        if (!login)
            return res.status(404).json({success: false, message: `Bank Login with id ${id} not found`, data: null});
        const updates = Object.keys(req.body);
        const allowedUpdates = ['status', 'type', 'includes', 'balance', 'price', 'country', 'bank'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed)
            return res.status(400).json({success: false, message: `Updates not allowed`, data: null});
        for (let key of updates) {
            login[key] = req.body[key];
        }
        const updatedCCDump = await login.save();
        await updatedCCDump.populate({path: 'bank'}).execPopulate();
        res.status(200).json({
            success: true,
            data: updatedCCDump,
            message: `Bank Login with id ${id} successfully updated`
        });
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.deleteLogin = async (req, res) => {
    try {
        const {id} = req.params;
        const login = await Login.findById(id).populate({path: 'bank'});
        if (!login)
            return res.status(404).json({success: false, message: `Bank Login with id ${id} not found`, data: null});
        login.status = 'Deleted';
        await login.save();
        await login.populate({path: 'bank'}).execPopulate();
        res.status(200).json({success: true, data: login, message: `Bank Login with id ${id} successfully deleted`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getLogins = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 20;
        const skip = (page - 1) * limit;
        const match = {};
        if (req.query.bank) {
            match['bank'] = req.query.bank;
        }
        if (req.query.country) {
            match['country'] = req.query.country;
        }
        const ccDumps = await Login.find(match).populate({path: 'bank'}).skip(skip).limit(limit);
        res.status(200).json({success: true, data: ccDumps, message: 'Bank Logins successfully retrieved'});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
