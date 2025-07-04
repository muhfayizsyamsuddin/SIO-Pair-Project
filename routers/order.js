const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/orderController')
const { isLogin, isAdmin } = require('../middleware/auth'); 

router.get('/', OrderController.getOrders)
router.post('/:menuId', OrderController.postOrder)
router.post('/:menuId/edit', OrderController.handlerEdit)
router.post('/:menuId/delete', OrderController.handlerDelete)
router.post('/:menuId/pay', OrderController.payOrder)
router.get('/invoice/:orderId', OrderController.downloadInvoice)

module.exports = router