const express = require('express');
const router = express.Router();

const { placeOrder, getMyOrders, getSingleOrder, updateOrderStatus, orderAgain } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

//Place Order
router.post('/place', protect, placeOrder);
//get user
router.get('/my-orders', protect, getMyOrders);
//new order again
router.get('/order-again', protect, orderAgain);
//get single order
router.get('/', protect, getSingleOrder);
//update order status
router.put('/status', protect, updateOrderStatus);


module.exports = router;
