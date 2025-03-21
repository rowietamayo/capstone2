const Product = require("../models/Product.js")
const Cart = require("../models/Cart.js")
const { errorHandler } = require("../auth.js")

module.exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    // Validate product
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const subtotal = product.price * quantity

    let cart = await Cart.findOne({ userId })

    if (cart) {
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.productId.toString() === productId
      )

      if (itemIndex > -1) {
        // Update existing item
        cart.cartItems[itemIndex].quantity += quantity
        cart.cartItems[itemIndex].subtotal += subtotal
      } else {
        cart.cartItems.push({
          productId,
          name: product.name,
          description: product.description,
          url: product.url,
          price: product.price,
          quantity,
          subtotal,
        })
      }

      cart.totalPrice += subtotal
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        cartItems: [
          {
            productId,
            name: product.name,
            description: product.description,
            url: product.url,
            price: product.price,
            quantity,
            subtotal,
          },
        ],
        totalPrice: subtotal,
      })
    }
    console.log("cartItems: ", cart)
    await cart.save()
    res.status(201).json({ message: "Item added to cart successfully", cart })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user.id

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    )
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" })
    }

    const oldSubtotal = cart.cartItems[itemIndex].subtotal
    const newSubtotal = product.price * quantity

    cart.cartItems[itemIndex].quantity = quantity
    cart.cartItems[itemIndex].subtotal = newSubtotal

    cart.totalPrice = cart.totalPrice - oldSubtotal + newSubtotal

    await cart.save()
    res.status(200).json({
      message: "Item quantity updated successfully",
      updatedCart: cart,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id
    console.log("Fetching cart for userId:", userId)
    const cart = await Cart.findOne({ userId }).populate(
      "cartItems.productId",
      "name price"
    )

    if (!cart) {
      console.log("Cart not found for userId:", userId)
      return res.status(404).json({ message: "Cart not found" })
    }

    console.log("Cart found:", cart)
    res.status(200).json({ cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

module.exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    console.log("User ID:", userId)

    let cart = await Cart.findOne({ userId })

    console.log("Cart:", cart)

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    )
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    const oldSubtotal = cart.cartItems[itemIndex].subtotal

    cart.cartItems.splice(itemIndex, 1)
    cart.totalPrice -= oldSubtotal

    await cart.save()

    res.status(200).json({
      message: "Item removed from cart successfully",
      updatedCart: cart,
    })
  } catch (error) {
    errorHandler(error, req, res, next)
  }
}

module.exports.clearCart = async (req, res, next) => {
  try {
    console.log("Clear cart request received")
    const userId = req.user.id
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      console.log("Cart not found")
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.cartItems = []
    cart.totalPrice = 0

    await cart.save()

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: cart,
    })
  } catch (error) {
    console.error("Error clearing cart:", error)
    errorHandler(error, req, res, next)
  }
}
