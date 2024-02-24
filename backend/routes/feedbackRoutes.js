const express = require("express")
const router = express.Router()
const {postFeedback} = require("../controllers/feedbackControllers")

router.post("/", postFeedback)


module.exports = router