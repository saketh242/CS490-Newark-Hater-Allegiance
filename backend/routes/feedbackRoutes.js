const express = require("express")
const router = express.Router()
const {postFeedback, getFeedback, getAverageRatings} = require("../controllers/feedbackControllers")
const decodeToken = require("../middleware/index")


router.post("/", decodeToken, postFeedback)
router.get("/getAverageRatings", getAverageRatings)
router.get("/getFeedback",getFeedback)


module.exports = router