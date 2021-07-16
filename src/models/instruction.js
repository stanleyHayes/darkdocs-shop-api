const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const instructionSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: {createdAt: true, updatedAt: true}});

const Instruction = mongoose.model('Instruction', instructionSchema);

module.exports = Instruction;
