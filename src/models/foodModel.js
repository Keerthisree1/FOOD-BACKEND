const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,
    },

    name: {
      type: String,
    },

    image: {
      type: String,
    },

    area: {
      type: String,
    },

    category: {
      type: String,
    },

    instructions: {
      type: String,
    },

    price:{
      type:Number,
      default:100
    }
  
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Food", foodSchema);
