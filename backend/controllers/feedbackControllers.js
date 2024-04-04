const User = require("../models/User");
const FeedBack = require("../models/Feedback");

const getFeedbackUser = async (uid) => {
    try {
        const user = await User.findOne({ _id: uid });

        if (!user) {
            return null;
        }

        return { firstName: user.firstName, lastName: user.lastName, email:user.email };
    } catch (error) {
        console.error('Error fetching user by uid'/*, error*/);
        return null;
    }
};

const validateFeedbackInput = (user_id, postId, Trating, Urating, ratingText) => {
    if (!user_id || !postId || !Trating || !Urating || !ratingText) {
        throw new Error('Missing required fields for feedback');
    }

    // Check if Trating and Urating are integers
    if (!Number.isInteger(Trating) || !Number.isInteger(Urating)) {
        throw new Error('Trating and Urating must be integer values');
    }
    
    if (Trating < 1 || Trating > 5 || Urating < 1 || Urating > 5) {
        throw new Error('Invalid rating values. Ratings should be between 1 and 5');
    }

    return true;
};


const postFeedback = async (req, res, next) => {
    try {
        const { user_id, postId, Trating, Urating, ratingText } = req.body;

        // Validate input
        try {
            validateFeedbackInput(user_id, postId, Trating, Urating, ratingText);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        const user = await getFeedbackUser(user_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = {
            textMessage: ratingText,
            TranslationRating: Trating,
            UXRating: Urating,
            user: user_id,
            history: postId,
        };

        const inserted = await FeedBack.create(post);
        res.status(200).send("Feedback inserted!");
    } catch (error) {
        // console.error("Error posting feedback:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getFeedback = async (req, res, next) => {
    try {
        const feedbacks = await FeedBack.find({ TranslationRating: 5, UXRating: 5 }).select('-_id rating textMessage user');
        
        // Fetch user details for each feedback
        const feedbacksWithUserDetails = await Promise.all(
            feedbacks.map(async (feedback) => {
                const user = await getFeedbackUser(feedback.user);
                return { ...feedback.toObject(), user };
            })
        );
        res.status(200).send(feedbacksWithUserDetails);
    } catch (error) {
        // console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.getFeedback = getFeedback;
module.exports.postFeedback = postFeedback;
