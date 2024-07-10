// const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is Required"],
  },
  productsOrdered: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is Required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is Required"],
      },
      subtotal: {
        type: Number,
        required: [true, "Subtotal is Required"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total Price is Required"],
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
})

// module.exports = mongoose.model("Order", orderSchema)
