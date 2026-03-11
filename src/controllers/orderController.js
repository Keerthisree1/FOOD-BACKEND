const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
//placeOrder
const mongoose = require("mongoose");

exports.placeOrder = async (req, res) => {
  try {

    const tokenUserId = req.user._id.toString();
    const { userId, deliveryAddress } = req.body;

    if (userId !== tokenUserId) {
      return res.status(403).json({
        message: "You cannot place order for another user"
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    // CREATE ORDER HERE
    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      orderStatus: "Pending",
      paymentStatus: "Pending"
    });

    res.status(201).json({
      success: true,
      message: "Order created",
      orderId: order._id,
      order
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
//getUser
exports.getMyOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const orders = await Order.find({ userId });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//order again post
exports.orderAgainPost = async (req, res) => {
  try {

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required"
      });
    }

    //Find old order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    //Find user's cart
    let cart = await Cart.findOne({ userId: order.userId });

    if (!cart) {
      cart = new Cart({
        userId: order.userId,
        items: [],
        totalAmount: 0
      });
    }

    //Add order items to cart
    order.items.forEach(item => {
      cart.items.push({
        foodId: item.foodId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      });

      cart.totalAmount += item.price * item.quantity;
    });

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Items added to cart successfully",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//new get order again 
exports.orderAgain = async (req, res) => {
  try {

    const orderId = req.query.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order items fetched successfully",
      items: order.items
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


//get single order
exports.getSingleOrder = async (req, res) => {
  try {
    const userId = req.user._id;        
    const { orderId } = req.query;      

    //Validate query param
    if (!orderId) {
      return res.status(400).json({
        message: 'orderId is required'
      });
    }

    //Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Not authorized to view this order'
      });
    }

    //Response
    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.query;
    const { status, deliveryAddress } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: 'orderId is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        message: 'status is required'
      });
    }

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    const allowedTransitions = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Preparing'],
      Preparing: ['Delivered'],
      Delivered: [],
      Cancelled: []
    };

    if (!allowedTransitions[order.orderStatus].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status transition'
      });
    }

    
    order.orderStatus = status;

    if (deliveryAddress) {
      order.deliveryAddress = deliveryAddress;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






