const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

router.get('/orders', orderController.getOrders);
router.post('/orders', orderController.createOrder);
router.post('/orders/:orderId/add-menu', orderController.addMenuToOrder);
router.get('/orders/:orderId', orderController.getOrderDetail);

module.exports = router