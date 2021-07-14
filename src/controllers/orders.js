exports.createOrder = async (req, res) => {
    try {
        res.status(201).json({data: {}, message: '', success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getOrder = async (req, res) => {
    try {
        res.status(200).json({data: {}, message: '', success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getOrders = async (req, res) => {
    try {
        res.status(200).json({data: {}, message: '', success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.updateOrder = async (req, res) => {
    try {
        res.status(200).json({data: {}, message: '', success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}


exports.deleteOrder = async (req, res) => {
    try {
        res.status(200).json({data: {}, message: '', success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
