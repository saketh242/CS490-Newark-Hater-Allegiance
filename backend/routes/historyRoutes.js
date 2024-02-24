const express = require("express")
const router = express.Router()
const {getAllHistory, postHistory} = require("../controllers/historyControllers")

router.get("/:id", getAllHistory)

router.post("/", postHistory)


module.exports = router