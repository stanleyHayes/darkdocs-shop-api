const Information = require('../models/information');

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
        const information = await Information.findOne({});
        res.status(200).json({message: `Information successfully retrieved`, data: information, success: true});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


module.exports = {updateInformation, getInformation};
