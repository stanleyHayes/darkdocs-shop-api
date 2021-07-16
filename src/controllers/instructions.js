const Instruction = require('../models/instruction');

exports.addInstruction = async (req, res) => {
    try {
        const {text} = req.body;
        const instruction = await Instruction.findOne({text});
        if(text.toLowerCase() === instruction.text.toLowerCase())
            return res.status(409).json({success: false, message: 'Instruction already exists', data: null});
        const savedInstruction = await Instruction.create({text});
        res.status(201).json({data: savedInstruction, message: 'Instruction successfully created', success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getInstructions = async (req, res) => {
    try{
        const instructions = await Instruction.find({});
        res.status(200).json({data: instructions, message: `${instructions.length} instructions retrieved`, success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.getInstruction = async (req, res) => {
    try{
        const {id} = req.params;
        const instruction = await Instruction.findById(id);
        if(!instruction)
            return res.status(404).json({data: null, message: `instruction with id ${id} not found`, success: false});
        res.status(200).json({data: instruction, message: `Instruction successfully retrieved`, success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.updateInstruction = async (req, res) => {
    try{
        const {id} = req.params;
        const instruction = await Instruction.findById(id);
        if(!instruction)
            return res.status(404).json({data: null, message: `instruction with id ${id} not found`, success: false});
        instruction['text'] = req.body.text;
        const updatedInstruction = await instruction.save();
        res.status(200).json({data: updatedInstruction, message: `Instruction successfully updated`, success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}

exports.deleteInstruction = async (req, res) => {
    try{
        const {id} = req.params;
        const instruction = await Instruction.findById(id);
        if(!instruction)
            return res.status(404).json({data: null, message: `instruction with id ${id} not found`, success: false});
        const removedInstruction = await instruction.remove();
        res.status(200).json({data: removedInstruction, message: `Instruction successfully deleted`, success: true});
    }catch (e) {
        res.status(400).json({message: `Error: ${e.message}`});
    }
}
