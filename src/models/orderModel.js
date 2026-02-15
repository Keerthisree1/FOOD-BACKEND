const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  foodId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
   image: {
    type: String
   }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    deliveryAddress: {
      type: String,
      required: true
    },

    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    }

  },
  {
    timestamps: true 
  }
);

orderSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.orderId = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Order', orderSchema);
