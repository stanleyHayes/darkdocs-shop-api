exports.createCCDump = async (req, res) => {
    try {
        const {name, country} = req.body;
        res.status(201).json({success: true, data: {}, message: 'CC Dumps successfully created'});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getCCDump = async (req, res) => {
    try {
        const {id} = req.params;
        res.status(200).json({success: true, data: {}, message: `CC Dumps with id ${id} retrieved`});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateCCDump = async (req, res) => {
    try {
        const {id} = req.params;
        res.status(200).json({success: true, data: {}, message: `CC Dumps with id ${id} successfully updated`});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.deleteCCDump = async (req, res) => {
    try {
        const {id} = req.params;
        res.status(200).json({success: true, data: {}, message: `CC Dumps with id ${id} successfully updated`});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getCCDumps = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 20;
        const skip = (page - 1) * limit;
        const match = {};

        res.status(200).json({success: true, data: {}, message: 'CC Dumps successfully created'});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
