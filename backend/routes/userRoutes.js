const express = require("express")
const router = express.Router()
const User = require("../models/User")

const {getUserId, insertUser, updateUser, deleteUser, disable2FA, edit2FA} = require("../controllers/userControllers")



router.post("/postUser", insertUser)

router.get("/", getUserId)


router.put("/updateUser", updateUser)

router.delete("/deleteUser", deleteUser)

router.put("/disable2FA", disable2FA)


module.exports = router