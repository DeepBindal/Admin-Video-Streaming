const express = require("express");
const { signupUser, loginUser, fetchUser } = require("../controllers/userControllers");
const asyncHandler = require('../utils/asyncHandler.js');
const router = express.Router();

router.route("/signup").post(asyncHandler(signupUser));
router.route("/login").post(asyncHandler(loginUser));
router.route("/user/:userId").get(asyncHandler(fetchUser));

module.exports = router