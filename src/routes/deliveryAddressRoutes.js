const express = require("express");
const router = express.Router();

const { addAddress, getAddress, updateAddress, deleteAddress } = require("../controllers/deliveryAddressController");
const { protect } = require("../middleware/authMiddleware");

router.post('/add', protect, addAddress);

router.get('/get', protect, getAddress);

router.put('/update', protect, updateAddress);

router.delete('/delete', protect, deleteAddress);

module.exports = router;