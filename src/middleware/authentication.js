const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/keys');
const User = require('../models/user');

const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success: false, data: null, message: 'unauthorized to access this route'});
        }
        next();
    }
}

const authenticate = async (req, res, next) => {
    try {
        if (!req.headers['authorization']) return res.status(400).json({
            data: null,
            token: null,
            message: 'invalid header format'
        });
        if (req.headers['authorization'] && req.headers['authorization'].split(' ')[0] !== 'Bearer')
            return res.status(400).json({data: null, token: null, message: 'invalid header format'});
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) return res.status(400).json({data: null, token: null, message: 'session expired'});
        const {_id} = jwt.verify(token, JWT_SECRET);
        if (!_id) return res.status(400).json({data: null, token: null, message: 'session expired'});
        const user = await User.findById(_id);
        if (!user) return res.status(400).json({data: null, token: null, message: 'session expired'});
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(400).json({message: `${e.message}`});
    }
}

module.exports = {authenticate, authorize};
