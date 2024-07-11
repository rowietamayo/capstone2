const Product = require("../models/Product.js")
const Cart = require("../models/Cart.js")
const { errorHandler } = require("../auth.js")

module.exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body

    // Validate product
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Calculate subtotal
    const subtotal = product.price * quantity

    // Find user's cart
    let cart = await Cart.findOne({ userId })

    if (cart) {
      // Check if product already in cart
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.productId.toString() === productId
      )

      if (itemIndex > -1) {
        // Update quantity and subtotal
        cart.cartItems[itemIndex].quantity += quantity
        cart.cartItems[itemIndex].subtotal += subtotal
      } else {
        // Add new item to cart
        cart.cartItems.push({ productId, quantity, subtotal })
      }

      // Update total price
      cart.totalPrice += subtotal
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        cartItems: [{ productId, quantity, subtotal }],
        totalPrice: subtotal,
      })
    }

    await cart.save()
    res
      .status(201)
      .json({ message: "Item added to cart successfully", cart: cart })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


module.exports.updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body

    // Validate product
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
    res
      .status(200)
      .json({
        message: "Item quantity updated successfully",
        updatedCart: cart,
      })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params

    const cart = await Cart.findOne({ userId }).populate("cartItems.productId")
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    res.status(200).json({ cart: cart })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.removeFromCart = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    
    const oldSubtotal = cart.cartItems[itemIndex].subtotal;

    cart.cartItems.splice(itemIndex, 1);

    cart.totalPrice -= oldSubtotal;

    await cart.save();
    
    res.status(200).json({
        message: "Item removed from cart successfully",
        updatedCart : cart
    });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

module.exports.clearCart = async (req, res, next) => {
  try {
    const { userId } = req.body; 
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
        message: "Cart cleared successfully",
        cart: cart
    });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};