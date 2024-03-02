const User = require("../models/User");
const FeedBack = require("../models/Feedback");

const getFeedbackUser = async (uid) => {
    try {
        const user = await User.findOne({ _id: uid });

        if (!user) {
            return null; 
        }

        return { firstName: user.firstName, lastName: user.lastName };
    } catch (error) {
        console.error('Error fetching user by uid:', error);
        throw error;
    }
};

const postFeedback = async (req, res, next) => {
    try {
        const { user_id, postId, rating, ratingText } = req.body;

        
        const user = await getFeedbackUser(user_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = {
            textMessage: ratingText,
            rating: rating,
            user: user_id, 
            history: postId,
        };

        const inserted = await FeedBack.create(post);
        res.status(200).send("Feedback inserted!");
    } catch (error) {
        console.error("Error posting feedback:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getFeedback = async (req, res, next) => {
    try {
        const feedbacks = await FeedBack.find({ rating: 5 }).select('-_id rating textMessage user');

        // Fetch user details for each feedback
        const feedbacksWithUserDetails = await Promise.all(
            feedbacks.map(async (feedback) => {
                const user = await getFeedbackUser(feedback.user);
                return { ...feedback.toObject(), user };
            })
        );

        console.log("All feedbacks with rating 5 and user details:", feedbacksWithUserDetails);
        res.send(feedbacksWithUserDetails);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.getFeedback = getFeedback;
module.exports.postFeedback = postFeedback;
