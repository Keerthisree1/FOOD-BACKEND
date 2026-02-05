//create order
const axios = require("axios");

exports.createOrder = async (req, res) => {
  try {
    const { amount, userId,} = req.body;

    if (!amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "amount and userIdare required"
      });
    }

    const orderId = "ORDER_" + Date.now();

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",

        customer_details: {
          customer_id: userId,
          customer_name: "Test User",
          customer_email: "test@gmail.com",
          customer_phone: "9999999999"
        },

        order_meta: {
          notify_url: process.env.CASHFREE_WEBHOOK_URL
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2025-01-01"
        }
      }
    );

    res.status(200).json({
      success: true,
      orderId,
      paymentSessionId: response.data.payment_session_id
    });
  } catch (error) {
    console.error("Create Order Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create order"
    });
  }
};

//cashfreeWebhook
exports.cashfreeWebhook = async (req, res) => {
  try {
    console.log("Cashfree Webhook Received");

    // Parse raw body
    const payload =
      req.body instanceof Buffer
        ? JSON.parse(req.body.toString())
        : req.body;

    const eventType = payload.type;
    const data = payload.data;

    if (eventType === "PAYMENT_SUCCESS") {
      const orderId = data.order.order_id;

      await Payment.findOneAndUpdate(
        { orderId },
        {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
          cfPaymentId: data.payment.cf_payment_id,
          customerId: data.customer_details.customer_id,
          customerEmail: data.customer_details.customer_email,
          customerPhone: data.customer_details.customer_phone
        }
      );

      console.log("Payment confirmed for order:", orderId);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ received: false });
  }
};

//verify payment

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.status(200).json({
      success: true,
      orderId: payment.orderId,
      orderStatus: payment.orderStatus,
      paymentStatus: payment.paymentStatus,
      customer: {
        customerId: payment.customerId,
        email: payment.customerEmail,
        phone: payment.customerPhone
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};

//createPaymentLink
//const axios = require("axios");

exports.createPaymentLink = async (req, res) => {
  try {
    const { paymentSessionId } = req.body;

    if (!paymentSessionId) {
      return res.status(400).json({
        success: false,
        message: "paymentSessionId required"
      });
    }

    //Cashfree DOES NOT return URL — you must construct it
    const paymentUrl = `https://sandbox.cashfree.com/pg/view/gateway?payment_session_id=${paymentSessionId}`;

    return res.status(200).json({
      success: true,
      paymentUrl
    });

  } catch (err) {
    console.error("Payment link error:", err.message);
    res.status(500).json({ success: false });
  }
};
