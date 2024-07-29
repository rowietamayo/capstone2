<<<<<<< HEAD
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const port = 4000;
=======
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userRoutes = require("./routes/user.js")
const productRoutes = require("./routes/product.js")
const cartRoutes = require("./routes/cart.js")
const orderRoutes = require("./routes/order.js")
const port = 4001
>>>>>>> f54095956206c26dd83fa878e078da093a1d851c

require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
<<<<<<< HEAD
  origin: ["capstone3-three-navy.vercel.app", "capstone3-git-master-jeswels-projects.vercel.app", "capstone3-budc27coh-jeswels-projects.vercel.app"],
=======
  origin: ["https://capstone3-beta-five.vercel.app"],
>>>>>>> f54095956206c26dd83fa878e078da093a1d851c
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

<<<<<<< HEAD
mongoose.connect(process.env.MONGODB_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
app.use("/b1/users", userRoutes);
app.use("/b1/products", productRoutes);
app.use("/b1/cart", cartRoutes);
app.use("/b1/orders", orderRoutes);
=======
mongoose
  .connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err))

app.use("/b1/users", userRoutes)
app.use("/b1/products", productRoutes)
app.use("/b1/cart", cartRoutes)
app.use("/b1/orders", orderRoutes)
>>>>>>> f54095956206c26dd83fa878e078da093a1d851c

app.listen(port, () =>
  console.log(`API is now available on port ${process.env.PORT || port}`)
)

module.exports = { app, mongoose }
