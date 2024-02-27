const express = require("express")
const router = express.Router()
const User = require("../models/User")
const {getUserId, insertUser} = require("../controllers/userControllers")


router.post("/postUser", insertUser)

router.get("/:uid", getUserId)

module.exports = router