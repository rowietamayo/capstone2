const Product = require("../models/Product")
const User = require("../models/User")
const { errorHandler } = require("../auth")

//Create a Product
module.exports.addProduct = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(401).send({ message: "Only admin can add products" })
  }

  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  })

  try {
    const existingProduct = await Product.findOne({ name: req.body.name })
    if (existingProduct) {
      return res.status(409).send({ message: "Product already exists" })
    } else {
      await newProduct.save()
      return res.send({
        product: newProduct,
      })
    }
  } catch (err) {
    errorHandler(err, req, res)
  }
}

//Retrieve all Products
module.exports.getAllProducts = (req, res) => {
  return Product.find({})
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send({ products: result })
      } else {
        return res.status(404).send({ message: "No products found" })
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//Retrieve all active products
module.exports.getAllActive = (req, res) => {
  Product.find({ isActive: true })
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send({ products: result })
      } else {
        return res.status(404).send(false)
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//Retrieve a single product
module.exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((product) => res.json({ product: product }))
    .catch((err) => errorHandler(err, req, res))
}

//Update a Product information
module.exports.updateProduct = (req, res) => {
  let updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  }

  return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then((product) => {
      if (product) {
        res.send({
          message: "product updated successfully",
          updatedProduct: product,
        })
      } else {
        res.status(404).send({ error: "Product not found" })
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//Archive a product
module.exports.archiveProduct = (req, res) => {
  let updateActiveField = {
    isActive: false,
  }

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (!product.isActive) {
          return res.status(200).send({
            message: "Product already archived",
            product: product,
          })
        }

        return res.status(200).send({
          message: "Product archived successfully",
          archiveProduct: product,
        })
      } else {
        return res.status(404).send({ message: "Product not found" })
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//Activate a product
module.exports.activateProduct = (req, res) => {
  let updateActiveField = {
    isActive: true,
  }

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (product.isActive) {
          return res.status(200).send({
            message: "Product already activated",
            product: product,
          })
        }

        return res.status(200).send({
          message: "Product activated successfully",
          activateProduct: product,
        })
      } else {
        return res.status(404).send({ message: "Product not found" })
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//search for products by their names
module.exports.searchProductByName = async (req, res) => {
  const name = req.body.name

  try {
    const result = await Product.find({ name: { $regex: name, $options: "i" } })
    if (result.length > 0) {
      return res.status(200).send(result)
    } else {
      return res.status(404).send({ message: "No products found" })
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occurred", error: error.message })
  }
}
//search for products by price range
module.exports.searchProductByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.body

  try {
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).select("price".reqbody)

    if (products.length > 0) {
      return res.status(200).send(products)
    } else {
      return res
        .status(404)
        .send({ message: "No products found in the given price range" })
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occurred", error: error.message })
  }
}
