const mongoose = require("mongoose");

const deliveryAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("DeliveryAddress", deliveryAddressSchema);