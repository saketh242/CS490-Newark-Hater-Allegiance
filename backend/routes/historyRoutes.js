const express = require("express")
const router = express.Router()
const {getAllHistory, postHistory} = require("../controllers/historyControllers")

router.get("/getAllHistory", getAllHistory)

router.post("/", postHistory)


module.exports = router