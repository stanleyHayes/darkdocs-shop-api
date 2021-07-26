const express = require('express');

const router = express.Router({mergeParams: true});
const {getInformation, updateInformation} = require('../controllers/information');
const {authenticate, authorize} = require('../middleware/authentication');

router.route('/')
    .get(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getInformation)
    .put(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateInformation);
module.exports = router;
