const express = require('express');

const router = express.Router({mergeParams: true});
const {getCCDumps, updateCCDump, getCCDump, createCCDump, deleteCCDump} = require('../controllers/dumps');
const {authenticate, authorize} = require('../middleware/authentication');

router.route('/')
    .post(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createCCDump)
    .get(authenticate, getCCDumps);

router.route('/:id')
    .get(authenticate, getCCDump)
    .put(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateCCDump)
    .delete(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteCCDump);

module.exports = router;
