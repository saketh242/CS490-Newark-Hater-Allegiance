const express = require("express")
const router = express.Router()
const User = require("../models/User")
const decodeToken = require("../middleware/index");

const {getUserId, insertUser, updateUser, deleteUser} = require("../controllers/userControllers")

router.post("/postUser", insertUser)

router.get("/", decodeToken, getUserId)

router.put("/updateUser", decodeToken, updateUser)

router.delete("/deleteUser", decodeToken, deleteUser)

module.exports = router