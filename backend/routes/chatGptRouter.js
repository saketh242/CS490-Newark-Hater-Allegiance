const express = require("express")
const router = express.Router()
const {postPrompt} = require("../controllers/openaiControllers.js")


router.post("/postTranslation", postPrompt)

module.exports = router