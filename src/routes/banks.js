const express = require('express');

const router = express.Router({mergeParams: true});
const {createBank, deleteBank, getBank, getBanks, updateBank} = require('../controllers/banks');
const {authenticate, authorize} = require('../middleware/authentication');

router.route('/')
    .post(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createBank)
    .get(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getBanks);

router.route('/:id')
    .get(authenticate, getBank)
    .put(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateBank)
    .delete(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteBank);

module.exports = router;
