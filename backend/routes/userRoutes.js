const express = require("express")
const router = express.Router()
const User = require("../models/User")
const {getUserId, insertUser, deleteUser} = require("../controllers/userControllers")


router.post("/postUser", insertUser)

router.get("/", getUserId)

router.delete("/deleteUser", deleteUser)

module.exports = router