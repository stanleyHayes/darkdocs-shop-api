const express = require('express');

const router = express.Router({mergeParams: true});
const {createCheque, deleteCheque, getCheque, updateCheque, getCheques} = require('../controllers/cheques');
const {authenticate} = require('../middleware/authentication');

router.route('/')
    .post(authenticate, createCheque)
    .get(authenticate, getCheques);

router.route('/:id')
    .get(authenticate, getCheque)
    .put(authenticate, updateCheque)
    .delete(authenticate, deleteCheque);

module.exports = router;
