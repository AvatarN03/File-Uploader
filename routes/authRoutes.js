const express = require("express");
const authController = require("../controllers/authController.js");
const multer = require("multer");


const router = express.Router();
const upload = multer();
router.post("/register", authController.register)

router.post("/login", authController.login)
router.get("/verify", authController.protect, authController.check )

module.exports = router;