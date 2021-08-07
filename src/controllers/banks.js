const Bank = require('../models/bank');

exports.createBank = async (req, res) => {
    try {
        const {name, country} = req.body;
        const existingBank = await Bank.findOne({name, country});
        if (existingBank) return res.status(409).json({message: 'Bank already exists', data: null, success: false});
        const bank = await Bank.create({name, country});
        res.status(201).json({success: true, data: bank, message: 'Bank successfully created'});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getBank = async (req, res) => {
    try {
        const {id} = req.params;
        const bank = await Bank.findById(id);
        if (!bank)
            return res.status(404).json({message: `Bank with id ${id} does not exist`, data: null, success: false});
        res.status(200).json({success: true, data: bank, message: `Bank with id ${id} retrieved`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateBank = async (req, res) => {
    try {
        const {id} = req.params;
        const bank = await Bank.findById(id);
        if (!bank)
            return res.status(404).json({message: `Bank with id ${id} does not exist`, data: null, success: false});
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'country'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed)
            return res.status(400).json({message: 'Updates not allowed'});
        for (let key of updates) {
            bank[key] = req.body[key];
        }
        const updatedBank = await bank.save();
        res.status(200).json({success: true, data: updatedBank, message: `Bank with id ${id} successfully updated`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.deleteBank = async (req, res) => {
    try {
        const {id} = req.params;
        const bank = await Bank.findById(id);
        if (!bank)
            return res.status(404).json({message: `Bank with id ${id} does not exist`, data: null, success: false});
        bank.status = 'Deleted';
        const updatedBank = await bank.save();
        res.status(200).json({success: true, data: updatedBank, message: `Bank with id ${id} successfully updated`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getBanks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 20;
        const skip = (page - 1) * limit;
        const match = {};
        if (req.query.country) {
            match['country'] = req.query.country;
        }
        const banksCount = await Bank.find(match).countDocuments();
        const banks = await Bank.find(match).skip(skip).limit(limit);
        res.status(200).json({success: true, banksCount, data: banks, message: 'Bank successfully created'});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
