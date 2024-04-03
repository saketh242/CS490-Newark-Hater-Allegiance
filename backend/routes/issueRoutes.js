const express = require("express")
const router = express.Router()
const { emailDev } = require("../controllers/issueController")

router.post("/", emailDev)

module.exports = router