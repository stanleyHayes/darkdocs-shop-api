const Order = require('../models/order');
const User = require('../models/user');

exports.createOrder = async (req, res) => {
    try {
        const {address, price, type, item} = req.body;
        const user= await User.findById(req.user._id);
        if(user.balance < price){
            return res.status(400).json({success: false, data: null, message: `Insufficient balance`});
        }
        const order = await Order.create({user: req.user, address, price, type, item});
        switch (type) {
            case 'Cheque':
                await order
                    .populate({path: 'user'})
                    .populate({path: 'item', populate: {path: 'cheque'}}).execPopulate();
                break;
            case 'Login':
                await order
                    .populate({path: 'user'})
                    .populate({path: 'item', populate: {path: 'login'}}).execPopulate();
                break;
            case 'Dumps':
                await order
                    .populate({path: 'user'})
                    .populate({path: 'item', populate: {path: 'ccDumps'}}).execPopulate();
                break;
        }
        res.status(201).json({data: order, message: 'Order successfully created', success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getOrder = async (req, res) => {
    try {
        const {id} = req.params;
        const order = await Order.findById(id).populate({path: 'user'});
        if (!order) {
            return res.status(404).json({success: false, message: `Order with id ${id} not found`, data: null});
        }
        switch (order.type) {
            case 'Cheque':
                await order
                    .populate({path: 'item', populate: {path: 'cheque'}}).execPopulate();
                break;
            case 'Login':
                await order
                    .populate({path: 'item', populate: {path: 'login'}}).execPopulate();
                break;
            case 'Dumps':
                await order
                    .populate({path: 'item', populate: {path: 'ccDumps'}}).execPopulate();
                break;
        }
        res.status(200).json({data: order, message: 'Order successfully retrieved', success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 20;
        const skip = (page - 1) * limit;
        const match = {};
        if(req.query.user){
            match['user'] = req.query.user;
        }
        if(req.query.type){
            match['type'] = req.query.type;
        }
        if(req.query.status){
            match['status'] = req.query.status;
        }
        const orders = await Order.find(match).skip(skip).limit(limit).populate({path: 'user'});
        await orders
            .populate({path: 'item', populate: {path: 'cheque'}})
            .populate({path: 'item', populate: {path: 'login'}})
            .populate({path: 'item', populate: {path: 'ccDumps'}}).execPopulate();
        res.status(200).json({data: orders, message: `${orders.length} orders retrieved successfully`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateOrder = async (req, res) => {
    try {
        const {id} = req.params;
        const order = await Order.findById(id).populate({path: 'user'});
        if (!order) {
            return res.status(404).json({success: false, message: `Order with id ${id} not found`, data: null});
        }
        const updates = Object.keys(req.body);
        const allowedUpdates = ['status',];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if(!isAllowed)
            return res.status(400).json({success: false, message: `Update not allowed`, data: null});
        for(let key of updates){
            order[key] = req.body[key];
        }
        const updatedOrder = await order.save();
        res.status(200).json({data: updatedOrder, message: `Order with id ${id} successfully updated`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.deleteOrder = async (req, res) => {
    try {
        const {id} = req.params;
        const order = await Order.findById(id).populate({path: 'user'});
        if (!order) {
            return res.status(404).json({success: false, message: `Order with id ${id} not found`, data: null});
        }
        order.status = 'Deleted';
        const updatedOrder = await order.save();
        res.status(200).json({data: updatedOrder, message: `Order with id ${id} successfully deleted`, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
