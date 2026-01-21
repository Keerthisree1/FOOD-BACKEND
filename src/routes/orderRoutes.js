const express = require('express');
const router = express.Router();

const { placeOrder, getUserOrders, getSingleOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

//Place Order
router.post('/place', protect, placeOrder);
//get user
router.get('/my-orders', protect, getUserOrders);
//get single order
router.get('/', protect, getSingleOrder);
//update order status
router.put('/status', protect, updateOrderStatus);


module.exports = router;
