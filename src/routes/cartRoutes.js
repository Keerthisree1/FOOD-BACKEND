const express = require('express');
const router = express.Router();
const { addToCart, getUserCart, updateCartItem, removeCartItem, clearCart, updateCartQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Task 16
router.post('/add', addToCart);

router.put('/update', protect, updateCartItem);

router.delete('/clear', protect, clearCart);

router.delete('/:foodId', protect, removeCartItem);

router.get('/:id', protect, getUserCart);

router.put('/quantity', protect, updateCartQuantity);



module.exports = router;
