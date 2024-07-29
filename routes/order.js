const express = require("express");
const orderController = require("../controllers/order.js");
const { verify, verifyNotAdmin, verifyAdmin } = require("../auth.js");

const router = express.Router();

router.post("/checkout", verify, verifyNotAdmin, orderController.checkoutOrders);
router.get("/my-orders", verify, verifyNotAdmin, orderController.myOrders);
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;
