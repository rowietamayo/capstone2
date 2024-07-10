const express = require("express")
const productController = require("../controllers/product")
const auth = require("../auth.js")
const { verify, verifyAdmin } = auth
const router = express.Router()

//create product (Admin)
router.post("/", verify, verifyAdmin, productController.addProduct)

//retrieving all products (Admin)
router.get("/all", verify, verifyAdmin, productController.getAllProducts)

// retrieving all active products
router.get("/", productController.getAllActive)

// retrieve single product
router.get("/:id", productController.getProduct)

//updating a product info (Admin)
router.patch(
  "/:productId",
  verify,
  verifyAdmin,
  productController.updateProduct
)

//archiving a product (Admin)
router.patch(
  "/:productId/archive",
  verify,
  verifyAdmin,
  productController.archiveProduct
)

//activating a product(Admin)
router.patch(
  "/:productId/activate",
  verify,
  verifyAdmin,
  productController.activateProduct
)

module.exports = router
