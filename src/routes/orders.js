const express = require('express');

const router = express.Router({mergeParams: true});
const {deleteOrder, getOrder, updateOrder, createOrder, getOrders} = require('../controllers/orders');
const {authenticate, authorize} = require('../middleware/authentication');

router.route('/')
    .post(authenticate, createOrder)
    .get(authenticate, getOrders);

router.route('/:id')
    .get(authenticate, getOrder)
    .put(authenticate, updateOrder)
    .delete(authenticate, deleteOrder);

module.exports = router;
