const express = require("express")
const router = express.router()
const User = require("../models/User")
const {getAllUsers, getUserId} = require("../controllers/userControllers")

router.get("/getAllUsers", getAllUsers)

router.get("/:id", getUserId)

module.exports = router