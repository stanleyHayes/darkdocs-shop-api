const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    try {
        const {address, price, type, item} = req.body;
        const order = await Order.create({user: req.user, address, price, type, item});
        const itemToPopulate = {};
        switch (type) {
            case 'Cheque':
                itemToPopulate['path'] = 'item.cheque';
        }
        const updatedOrder = await order.populate({path: 'user'}).path({}).execPopulate();
        res.status(201).json({data: updatedOrder, message: 'Order successfully created', success: true});
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
        const orders = await Order.find(match).populate({path: 'user'});
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
        const allowedUpdates = ['status', 'amount'];
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
