const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    amount: Number,

    // payment info
    paymentStatus: {
      type: String,
      default: "PENDING"
    },
    orderStatus: {
      type: String,
      default: "PENDING"
    },
    cfPaymentId: String,

    // customer details (FROM WEBHOOK)
    customerEmail: String,
    customerPhone: String,
    customerId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
