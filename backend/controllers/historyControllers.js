const History = require("../models/History")

const getAllHistory = async (req, res, next) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'Missing required field to get history' });
        }
        const histories = await History.find({ user: user_id })
                                        .select('_id Desired_language Source_language original_code converted_code createdAt')
                                        .sort({ createdAt: -1 });
        console.log("All history:", histories);
        res.send(histories);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Unused right now, will be used later when fully implementing history
const getPost = async (req, res, next) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ error: 'Missing required field to get post' });
        }
        const post = await History.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post._id);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send("Internal Server Error");
    }
};


const postHistory = async(req, res, next) => {
    try {
        const { user_id, inputCode, translateCode, sourceLanguage, desiredLanguage } = req.body;

        if (!user_id || !inputCode || !translateCode || !sourceLanguage || !desiredLanguage) {
            return res.status(400).json({ error: 'Missing required fields to post' });
        }
        const post = {
            original_code: inputCode,
            Source_language: sourceLanguage,
            Desired_language: desiredLanguage,
            converted_code: translateCode,
            user: user_id
        }
        const inserted = await History.create(post);
        res.status(200).send(inserted._id);
    } catch(error) {
        console.error("Error fetching all users:", error);
        res.status(500).send("Internal Server Error");
    }
}



module.exports.getAllHistory = getAllHistory
module.exports.postHistory = postHistory