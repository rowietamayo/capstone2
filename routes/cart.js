const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cart.js")
const auth = require("../auth.js")

// Middleware
const { verify, verifyNotAdmin } = auth

// Routes
router.post("/add-to-cart", verify, verifyNotAdmin, cartController.addToCart)
router.patch(
  "/update-cart-quantity",
  verify,
  verifyNotAdmin,
  cartController.updateCartQuantity
)
router.get("/get-cart/:userId", verify, verifyNotAdmin, cartController.getCart)

router.patch(
  "/:productId/remove-from-cart",
  verify,
  verifyNotAdmin,
  cartController.removeFromCart
)

router.put("/clear-cart", verify, verifyNotAdmin, cartController.clearCart)

module.exports = router
