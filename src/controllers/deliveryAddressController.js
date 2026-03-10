const DeliveryAddress = require("../models/deliveryAddressModel");

exports.addAddress = async (req, res) => {
  try {

    const {userId, deliveryAddress } = req.body;

    const address = await DeliveryAddress.create({
      userId,
      deliveryAddress
    });

    res.status(201).json({
      success: true,
      message: "Delivery address added",
      data: address
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get
exports.getAddress = async (req, res) => {
  try {

    const address = await DeliveryAddress.find({
      userId: req.user._id
    });

    res.status(200).json({
      success: true,
      data: address
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update
exports.updateAddress = async (req, res) => {
  try {

    const { deliveryAddress } = req.body;

    const updatedAddress = await DeliveryAddress.findOneAndUpdate(
      { userId: req.user._id },
      { deliveryAddress },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated",
      data: updatedAddress
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//delete
exports.deleteAddress = async (req, res) => {
  try {

    const deletedAddress = await DeliveryAddress.findOneAndDelete({
      userId: req.user._id
    });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};