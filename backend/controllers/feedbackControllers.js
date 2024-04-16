const User = require("../models/User");
const FeedBack = require("../models/Feedback");
const logger = require('../logs/logger');

const getFeedbackUser = async (uid) => {
    try {
        const user = await User.findOne({ _id: uid });

        if (!user) {
            return null;
        }

        return { firstName: user.firstName, lastName: user.lastName, email:user.email };
    } catch (error) {
        // console.error('Error fetching user by uid'/*, error*/);
        logger.error(`Error: error fetching user by uid, ${error.message}, 
        Location: backend/controllers/feedbackControllers.js`);

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
        logger.error(`Error: error posting feedback, ${error.message}, 
        Location: backend/controllers/feedbackControllers.js`);
    }
};


const getFeedback = async (req, res, next) => {
    try {
        const feedbacks = await FeedBack.aggregate([
            {
                $match: {
                    TranslationRating: 5,
                    UXRating: 5,
                    $expr: { $lte: [{ $strLenCP: "$textMessage" }, 150] }
                }
            },
            {
                $group: {
                    _id: "$user", 
                    feedback: { $first: "$$ROOT" }
                }
            },
            {
                $limit: 5
            }
        ]);

        const feedbacksWithUserDetails = await Promise.all(
            feedbacks.map(async ({ feedback }) => {
                const user = await getFeedbackUser(feedback.user);
                const { _id, ...feedbackDataWithoutId } = feedback;
                return { ...feedbackDataWithoutId, user };
            })
        );

        res.status(200).send(feedbacksWithUserDetails);
    } catch (error) {
        // console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: 'Internal Server Error' });
        logger.error(`Error: error fetching feedbacks, ${error.message}, 
        Location: backend/controllers/feedbackControllers.js`);
    }
};

const getAverageRatings = async (req, res, next) => {
    try {
        const totalFeedbacks = await FeedBack.countDocuments();
        if (totalFeedbacks === 0) {
            res.status(404).json({error: "No feedbacks found."});
        }

        const result = await FeedBack.aggregate([
            {
                $group: {
                    _id: null,
                    averageTranslationRating: { $avg: "$TranslationRating" },
                    averageUXRating: { $avg: "$UXRating" },
                }
            }
        ]);

        const { averageTranslationRating, averageUXRating } = result[0];
        const totalFeedbackAverage = ((averageTranslationRating + averageUXRating) / 2).toFixed(1);
        const roundedTranslationRating = averageTranslationRating.toFixed(1); 
        const roundedUXRating = averageUXRating.toFixed(1); 

        res.status(200).send({
            totalFeedbackAverage,
            averageTranslationRating: roundedTranslationRating,
            averageUXRating: roundedUXRating,
            count: totalFeedbacks
        });

    } catch (error) {
        res.status(500).json({ error: 'Error calculating average rating' });
        logger.error(`Error: error calculating average rating, ${error.message}, 
        Location: backend/controllers/feedbackControllers.js`);
    }
};

module.exports.getFeedback = getFeedback;
module.exports.postFeedback = postFeedback;
module.exports.getAverageRatings = getAverageRatings;

