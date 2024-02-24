const FeedBack = require("../models/Feedback")

const postFeedback = async (req, res, next) => {
    try {
        /*
        const {id} = req.bo
        const histories = await History.find({user: id});
        console.log("All users:", histories);
        */
        res.send("gruh");
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).send("Internal Server Error");
    }
};



module.exports.postFeedback = postFeedback