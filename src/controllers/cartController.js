const Cart = require('../models/cartModel');
const Food = require('../models/foodModel');

//Add item to cart
exports.addToCart = async (req, res) => {
  try {
    
    const { foodId, quantity, userId } = req.body;

    // 1. Find food
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // 2. Find cart
    let cart = await Cart.findOne({ userId });

    // 3. If cart not exists → create
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalAmount: 0
      });
    }

    // 4. Check if item already exists
    const itemIndex = cart.items.findIndex(
      item => item.foodId.toString() === foodId
    );

    if (itemIndex > -1) {
      // Increase quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        foodId: food._id,
        name: food.name,
        image: food.image,
        price: food.price,
        quantity
      });
    }

    // 5. Recalculate totalAmount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // 6. Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        totalAmount: 0
      });
    }

    res.status(200).json({
      success: true,
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//update
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("userId:", userId);
    const { foodId, quantity } = req.body;
    console.log("foodId: ", foodId);
    console.log("JWT userId:", req.user._id.toString());

    //Validate input
    if (!foodId || quantity === undefined) {
      return res.status(400).json({
        message: 'foodId and quantity are required'
      });
    }
    if (quantity <= 0) {
      return res.status(400).json({
        message: 'Quantity cannot be negative'
      });
    }
    //Find user's cart
    const cart = await Cart.findOne({ userId });
    console.log("cart: ", cart);
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    //Find item index
    const itemIndex = cart.items.findIndex(
      item => item.foodId === foodId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'Item not found in cart'
      });
    }

    //If quantity = 0 → remove item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } 
    //Else update quantity
    else {
      cart.items[itemIndex].quantity = quantity;
    }

    //Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    //Save cart
    await cart.save();

    //Send response
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      items: cart.items,
      totalAmount: cart.totalAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//remove
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;          
    const { foodId } = req.query;        

    //Validate param
    if (!foodId) {
      return res.status(400).json({
        message: 'foodId is required'
      });
    }

    //Find user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    //Check item exists
    const itemIndex = cart.items.findIndex(
      item => item.foodId === foodId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'Item not found in cart'
      });
    }

    //Remove item
    cart.items.splice(itemIndex, 1);

    //Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    //Save cart
    await cart.save();

    //Response
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      items: cart.items,
      totalAmount: cart.totalAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//clearCart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    //Find user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    //Clear cart
    cart.items = [];
    cart.totalAmount = 0;

    //Save
    await cart.save();

    //Response
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      items: cart.items,
      totalAmount: cart.totalAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



