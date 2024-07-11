const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.js");
const auth = require("../auth.js");

// Middleware
const { verify, verifyNotAdmin } = auth;

// Routes
router.post("/add-to-cart", verify, verifyNotAdmin, cartController.addToCart);
router.patch("/update-cart-quantity", verify, verifyNotAdmin, cartController.updateCartQuantity);
router.get("/get-cart/:userID", verify, verifyNotAdmin, cartController.getCart);

module.exports = router;