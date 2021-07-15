exports.createLogin = async (req, res) => {
    try {
        const {name, country} = req.body;
        res.status(201).json({success: true, data: {}, message: 'Bank successfully created'});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getLogin = async (req, res) => {
    try {
        const {id} = req.params;
        res.status(200).json({success: true, data: {}, message: `Bank with id ${id} retrieved`});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateLogin = async (req, res) => {
    try {
        const {id} = req.params;
        res.status(200).json({success: true, data: {}, message: `Bank with id ${id} successfully updated`});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.deleteLogin = async (req, res) => {
    try {
        const {id} = req.params;
        res.status(200).json({success: true, data: {}, message: `Bank with id ${id} successfully updated`});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.getLogins = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 20;
        const skip = (page - 1) * limit;
        const match = {};
        if(req.query.user){
            match['user'] = req.query.user;
        }
        res.status(200).json({success: true, data: {}, message: 'Bank successfully created'});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
