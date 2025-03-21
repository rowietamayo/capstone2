const Product = require("../models/Product.js")
const Cart = require("../models/Cart.js")
const Order = require("../models/Order.js")
const { errorHandler } = require("../auth.js")

module.exports.checkoutOrders = async (req, res) => {
  try {
    const { userId } = req.user.id
    const cart = await Cart.findOne({ userId }).populate("cartItems.productId")
    console.log(cart)

    if (!cart || cart.cartItems.length === 0) {
      return res.status(404).json({ error: "No items to checkout" })
    }

    const order = new Order({
      userId: cart.userId,
      productsOrdered: cart.cartItems,
      totalPrice: cart.totalPrice,
    })
    console.log({ uuuuuuserId: order })

    await order.save()

    // Clear the cart
    cart.cartItems = []
    cart.totalPrice = 0
    await cart.save()

    res.status(201).json({ message: "Ordered successfully" })
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

module.exports.myOrders = async (req, res) => {
  try {
    const userId = req.user.id
    console.log("User ID:", userId)

    const orders = await Order.find({ userId })
    console.log("Orders without populate:", orders)

    const populatedOrders = await Order.find({ userId }).populate(
      "productsOrdered.productId"
    )
    console.log("Populated Orders:", populatedOrders)

    if (!populatedOrders.length) {
      return res.status(404).json({ message: "No orders found for this user" })
    }

    res.status(200).json({ orders: populatedOrders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ message: "Internal server error", error })
  }
}

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "productsOrdered.productId userId"
    )

    console.log({ uuuuuuserId: orders })
    res.status(200).json({ orders })
  } catch (error) {
    console.error("Error fetching all orders:", error)
    res.status(500).json({ message: "Internal server error", error })
  }
}
