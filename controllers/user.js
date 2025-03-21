const bcrypt = require("bcrypt")
const User = require("../models/User.js")
// Importing auth.js
const auth = require("../auth.js")
const { errorHandler } = auth

// User Registration
module.exports.registerUser = (req, res) => {
  const errors = {}

  // Validate first name
  if (!req.body.firstName || req.body.firstName.trim() === "") {
    errors.firstName = "First name is required"
  }

  // Validate last name
  if (!req.body.lastName || req.body.lastName.trim() === "") {
    errors.lastName = "Last name is required"
  }

  // Validate email format
  if (!req.body.email || !req.body.email.includes("@")) {
    errors.email = "Email is invalid"
  }

  // Validate mobile number
  if (!req.body.mobileNo || req.body.mobileNo.length !== 11) {
    errors.mobileNo = "Mobile number must be 11 digits"
  }

  // Validate password length
  if (!req.body.password || req.body.password.length < 8) {
    errors.password = "Password must be at least 8 characters long"
  }

  // Confirm password
  if (req.body.password !== req.body.verifyPassword) {
    errors.verifyPassword = "Passwords do not match"
  }

  // If there are any errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).send({ errors })
  }

  // If all validations pass, create a new user
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    password: bcrypt.hashSync(req.body.password, 10),
  })

  return newUser
    .save()
    .then(() => res.status(201).send({ message: "Registered successfully" }))
    .catch((error) => errorHandler(error, req, res))
}

//User authentication
module.exports.loginUser = (req, res) => {
  const email = req.body.email
  if (!email.includes("@")) {
    return res.status(400).send({ error: "invalid email" })
  }
  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result === null) {
        return res.status(404).send({ error: "no email found" })
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        )

        if (!isPasswordCorrect) {
          return res
            .status(401)
            .send({ error: "email and password do not match" })
        } else {
          return res.send({ access: auth.createAccessToken(result) })
        }
      }
    })
    .catch((err) => errorHandler(error, req, res))
}
// Set user as Admin (Admin only)
module.exports.updateAdmin = async (req, res) => {
  const id = req.params.id

  try {
    let user = await User.findById(id)

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        stringValue: "",
        valueType: "",
        kind: "",
        value: "",
        path: "",
        reason: "User not found",
        name: "NotFoundError",
        message: "No error",
      })
    }

    if (!user.isAdmin) {
      user.isAdmin = true
      await user.save()
    }

    return res.send({
      updatedUser: user,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      error: "Failed in find",
      details: {
        stringValue: err.stringValue || "",
        valueType: err.valueType || "",
        kind: err.kind || "",
        value: err.value || "",
        path: err.path || "",
        reason: err.reason || "",
        name: err.name || "",
        message: err.message,
      },
    })
  }
}

//Retrieve user details
module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(403).send({ error: "User not found" })
      } else {
        user.password = ""
        return res.status(200).send({ user: user })
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

// Update password
module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body
    const { id } = req.user

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(id, { password: hashedPassword })
    res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}
