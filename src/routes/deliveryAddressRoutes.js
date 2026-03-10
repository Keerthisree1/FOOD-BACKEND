const express = require("express");
const router = express.Router();

const { addAddress, getAddress, updateAddress } = require("../controllers/deliveryAddressController");
const { protect } = require("../middleware/authMiddleware");

router.post('/add', protect, addAddress);

router.get('/get', protect, getAddress);

router.put('/update/:id', protect, updateAddress);

module.exports = router;