const CCDump = require('../models/dumps');

exports.createCCDump = async (req, res) => {
    try {
        const {service, bin, type, countryMark, dumpedIn, bankBase, quantity, price} = req.body;
        const ccDump = await CCDump.create({service, bin, type, countryMark, dumpedIn, bankBase, quantity, price});
        res.status(201).json({success: true, data: ccDump, message: 'CC Dumps successfully created'});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getCCDump = async (req, res) => {
    try {
        const {id} = req.params;
        const ccDump = await CCDump.findById(id).populate({path: 'bankBase'});
        if(!ccDump)
            return res.status(404).json({success: false, message: `CC with id ${id} not found`, data: null});
        res.status(200).json({success: true, data: ccDump, message: `CC Dumps with id ${id} retrieved`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateCCDump = async (req, res) => {
    try {
        const {id} = req.params;
        const ccDump = await CCDump.findById(id);
        if(!ccDump)
            return res.status(404).json({success: false, message: `CC with id ${id} not found`, data: null});
        const updates = Object.keys(req.body);
        const allowedUpdates = ['quantity', 'price', 'dumpedIn', 'countryMark', 'type', 'bin','service','bankBase'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if(!isAllowed)
            return res.status(400).json({success: false, message: `Updates not allowed`, data: null});
        for (let key of updates){
            ccDump[key] = req.body[key];
        }
        const updatedCCDump = await ccDump.save();
        res.status(200).json({success: true, data: updatedCCDump, message: `CC Dumps with id ${id} successfully updated`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.deleteCCDump = async (req, res) => {
    try {
        const {id} = req.params;
        const ccDump = await CCDump.findById(id);
        if(!ccDump)
            return res.status(404).json({success: false, message: `CC with id ${id} not found`, data: null});
        ccDump.status = 'Deleted';
        const updatedCCDump = await ccDump.save();
        res.status(200).json({success: true, data: updatedCCDump, message: `CC Dumps with id ${id} successfully deleted`});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getCCDumps = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 20;
        const skip = (page - 1) * limit;
        const match = {};
        const ccDumps = await CCDump.find(match).skip(skip).limit(limit);
        res.status(200).json({success: true, data: ccDumps, message: 'CC Dumps successfully created'});
    } catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
