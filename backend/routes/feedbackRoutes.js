const express = require("express")
const router = express.Router()
const {postFeedback, getFeedback} = require("../controllers/feedbackControllers")

router.post("/", postFeedback)

router.get("/getFeedback",getFeedback)


module.exports = router