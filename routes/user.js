const express = require("express")
const userController = require("../controllers/user.js")
const { verify, isLoggedIn, verifyAdmin } = require("../auth.js")
const auth = require("../auth")
const router = express.Router()

// user registration
router.post("/register", userController.registerUser)

// user authentication
router.post("/login", userController.loginUser)

//retrieve user details
router.get("/details", verify, userController.getProfile)

// update user as admin
router.put("/:id/set-as-admin", verify, verifyAdmin, userController.updateAdmin)

// update password
router.patch("/update-password", verify, userController.updatePassword)

module.exports = router
