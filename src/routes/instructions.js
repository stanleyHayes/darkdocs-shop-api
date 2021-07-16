const express = require('express');

const router = express.Router({mergeParams: true});

const {authenticate, authorize} = require('../middleware/authentication');
const {
    addInstruction,
    deleteInstruction,
    getInstruction,
    getInstructions,
    updateInstruction
} = require('../controllers/instructions');

router.route('/')
    .post(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), addInstruction)
    .get(authenticate, getInstructions);

router.route('/:id')
    .get(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getInstruction)
    .put(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateInstruction)
    .delete(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteInstruction);

module.exports = router;
