const express = require("express")
const router = express.Router()
const User = require("../models/User")

const {getUserId, insertUser, updateUser, deleteUser} = require("../controllers/userControllers")



router.post("/postUser", insertUser)

router.get("/", getUserId)


router.put("/updateUser", updateUser)

router.delete("/deleteUser", deleteUser)


module.exports = router