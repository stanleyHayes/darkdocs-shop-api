const express = require('express');

const router = express.Router({mergeParams: true});

const {authenticate, authorize} = require('../middleware/authentication');
const {getLogins, createLogin, deleteLogin, getLogin, updateLogin} = require('../controllers/logins');

router.route('/')
    .post(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createLogin)
    .get(authenticate, getLogins);

router.route('/:id')
    .get(authenticate, getLogin)
    .put(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateLogin)
    .delete(authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteLogin);

module.exports = router;
