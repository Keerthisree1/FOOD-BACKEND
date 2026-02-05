const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/paymentController');
const { cashfreeWebhook } = require('../controllers/paymentController');
const { createPaymentLink } = require("../controllers/paymentController");

router.post('/create-order', createOrder);
router.post('/cashfree-webhook', cashfreeWebhook);
router.post("/pay", createPaymentLink);

module.exports = router;
