const Information = require('../models/information');
const User = require('../models/user');
const Bank = require('../models/bank');
const Cheque = require('../models/cheque');
const Order = require('../models/order');
const Fund = require('../models/fund');
const Dumps = require('../models/dumps');
const Login = require('../models/login');

const updateInformation = async (req, res) => {
    try {
        const allowedUpdates = ['email', 'btcAddress'];
        const updates = Object.keys(req.body);
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed)
            return res.status(400).json({success: false, message: `Updates not allowed`, data: null});
        const information = await Information.findOne({});
        for (let key of updates) {
            information[key] = req.body[key];
        }
        const savedInformation = await information.save();
        res.status(200).json({message: `Information successfully updated`, data: savedInformation, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


const getInformation = async (req, res) => {
    try {
        const information = await Information.find({});
        let email = 'darkdocsshop@protonmail.com';
        let btcAddress = 'bc1quvwx4008j0fn3u73uqa9qlhzz8nvmr8axc5zya';
       if(information.length > 0){
           email = information[0].email;
           btcAddress = information[0].btcAddress;
       }
        const users = await User.find({role: 'USER'}).countDocuments();
        const admins = await User.find({role: 'ADMIN'}).countDocuments();
        const superAdmins = await User.find({role: 'SUPER_ADMIN'}).countDocuments();

        const usaBanks = await Bank.find({country: 'USA'}).countDocuments();
        const ukBanks = await Bank.find({country: 'UK'}).countDocuments();
        const canadaBanks = await Bank.find({country: 'Canada'}).countDocuments();

        const pendingCheques = await Cheque.find({status: 'Pending'}).countDocuments();
        const completedCheques = await Cheque.find({status: 'Completed'}).countDocuments();

        const pendingFunds = await Fund.find({status: 'Pending'}).countDocuments();
        const completedFunds = await Fund.find({status: 'Completed'}).countDocuments();

        const ccDumpsOrders = await Order.find({type: 'Dump'}).countDocuments();
        const bankLoginsOrders = await Order.find({type: 'Login'}).countDocuments();

        const logins = await Login.find({}).countDocuments();
        const dumps = await Dumps.find({}).countDocuments();

        res.status(200).json({
            message: `Information successfully retrieved`,
            data: {
                email,
                btcAddress,
                usersCount: users,
                adminsCount: admins,
                superAdminsCount: superAdmins,
                usaBanksCount: usaBanks,
                ukBanksCount: ukBanks,
                canadaBanksCount: canadaBanks,
                pendingChequesCount: pendingCheques,
                completedChequesCount: completedCheques,
                pendingFundsCount: pendingFunds,
                completedFundsCount: completedFunds,
                ccDumpsOrdersCount: ccDumpsOrders,
                bankLoginsOrdersCount: bankLoginsOrders,
                loginsCount: logins,
                dumpsCount: dumps
            },
            success: true
        });
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


module.exports = {updateInformation, getInformation};
