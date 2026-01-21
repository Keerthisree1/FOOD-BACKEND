const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { deliveryAddress } = req.body;

    //Validate input
    if (!deliveryAddress) {
      return res.status(400).json({
        message: 'Delivery address is required'
      });
    }

    //Fetch user cart
    const cart = await Cart.findOne({ userId });

    //Create order
    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        foodId: item.foodId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cart.totalAmount,
      deliveryAddress
    });

    //Save order
    await order.save();

    //Clear cart after order
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    //Response
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getUser
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const { status } = req.body;

    //Validate query
    if (!orderId) {
      return res.status(400).json({
        message: 'orderId is required'
      });
    }

    //Validate body
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

    //Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    //Validate transition
    const allowedTransitions = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Preparing'],
      Preparing: ['Delivered'],
      Delivered: [],
      Cancelled: []
    };

    //Update
    order.orderStatus = status;
    await order.save();

    //Response
    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





