const Cheque = require('../models/cheque');

exports.createCheque = async (req, res) => {
    try {
        const {balance, address, price} = req.body;
        const cheque = await Cheque.create({price, balance, address, user: req.user});
        await cheque.populate('user').execPopulate();
        res.status(201).json({data: cheque, message: 'Created cheque successfully', success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getCheques = async (req, res) => {
    try {
        const match = {};
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 10;
        const skip = (page - 1) * limit;
        if (req.query.user) {
            match['user'] = req.query.user;
        }
        if (req.query.status) {
            match['status'] = req.query.status;
        }
        const cheques = await Cheque.find(match).populate({path: 'user'}).skip(skip).limit(limit);
        res.status(200).json({data: cheques, message: `${cheques.length} cheques retrieved`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getCheque = async (req, res) => {
    try {
        const {id} = req.params;
        const cheque = await Cheque.findById(id).populate({path: 'user'});
        if (!cheque)
            return res.status(404).json({message: `Cheque with id ${id} not found`, success: false, data: null});
        res.status(200).json({data: cheque, message: `Cheque with id ${id} retrieved`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateCheque = async (req, res) => {
    try {
        const {id} = req.params;
        const cheque = await Cheque.findById(id).populate({path: 'user'});
        if (!cheque)
            return res.status(404).json({message: `Cheque with id ${id} not found`, success: false, data: null});
        const updates = Object.keys(req.body);
        const allowedUpdates = ['status', 'balance', 'address'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed)
            return res.status(400).json({message: `Updates not allowed`, success: false, data: null});
        for (let key of updates) {
            cheque[key] = req.body[key];
        }
        const updatedCheque = await cheque.save();
        await updatedCheque.populate({path: 'user'}).execPopulate();
        res.status(200).json({data: updatedCheque, message: `Cheque with id ${id} retrieved updated`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.deleteCheque = async (req, res) => {
    try {
        const {id} = req.params;
        const cheque = await Cheque.findById(id).populate({path: 'user'});
        if (!cheque)
            return res.status(404).json({message: `Cheque with id ${id} not found`, success: false, data: null});
        cheque.status = 'deleted';
        const updatedCheque = await cheque.save();
        const populatedCheque = updatedCheque.populate({path: 'user'}).execPopulate();
        res.status(200).json({data: populatedCheque, message: `Cheque with id ${id} retrieved deleted`, success: true});
        res.status(200).json({data: null, message: `Cheque with id id deleted`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
