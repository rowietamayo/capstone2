const express = require("express")
const orderController = require("../controllers/order.js")
const auth = require("../auth.js")
const { verify, verifyAdmin, verifyNotAdmin } = auth

const router = express.Router()

router.post("/checkout", verify, verifyNotAdmin, orderController.checkoutOrders)

router.get(
  "/my-orders/",
  verify,
  verifyNotAdmin,
  orderController.myOrders
)

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders)

module.exports = router