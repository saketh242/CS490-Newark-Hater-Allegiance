const express = require("express")
const router = express.Router()
const User = require("../models/User")
const {getAllUsers, getUserId, insertUser} = require("../controllers/userControllers")

router.get("/getAllUsers", getAllUsers)

router.post("/postUser", insertUser)

router.get("/:id", getUserId)

module.exports = router