const DeliveryAddress = require("../models/deliveryAddressModel");

exports.addAddress = async (req, res) => {
  try {

    const { deliveryAddress } = req.body;

    const address = await DeliveryAddress.create({
      userId: req.user._id,
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

    const addressId = req.params.id;

    const updatedAddress = await DeliveryAddress.findByIdAndUpdate(
      addressId,
      { deliveryAddress: req.body.deliveryAddress },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated",
      data: updatedAddress
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};