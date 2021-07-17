const express = require('express');

const router = express.Router({mergeParams: true});
const {deleteFund, getFund, updateFund, createFund, getFunds} = require('../controllers/funds');
const {authenticate} = require('../middleware/authentication');

router.route('/')
    .post(authenticate, createFund)
    .get(authenticate, getFunds);

router.route('/:id')
    .get(authenticate, getFund)
    .put(authenticate, updateFund)
    .delete(authenticate, deleteFund);

module.exports = router;
