const History = require("../models/History")
const logger = require('../logs/logger');

const getAllHistory = async (req, res, next) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'Missing required field to get history' });
        }
        const histories = await History.find({ user: user_id })
            .select('_id Desired_language Source_language original_code converted_code createdAt')
            .sort({ createdAt: -1 });
        res.status(200).send(histories);
    } catch (error) {
        // console.error("Error fetching all users:", error);
        logger.error(`Error: ${error.message}, Location: backend/controllers/historyControllers.js`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteHistory = async (req, res, next) => {
    try {
        console.log(req.query)
        const { user_id, history_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: 'Missing userID to delete history' });
        }

        if (history_id) {
            // deletes ONE record
            const deletedHistory = await History.findByIdAndDelete(history_id);
            if (!deletedHistory) {
                return res.status(404).json({ error: 'History not found' });
            }
            res.status(200).json({ message: 'Record deleted successfully' });
        } else {
            // Delete ALL records
            const deletedHistories = await History.deleteMany({ user: user_id });
            if (!deletedHistories) {
                return res.status(404).json({ error: 'Histories not found' });
            }
            res.status(200).json({ message: `Sucessfully cleared all history` });
        }
    } catch (error) {
        logger.error(`Error: ${error.message}, Location: backend/controllers/historyControllers.js`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const postHistory = async (req, res, next) => {
    try {
        const { user_id, inputCode, translateCode, sourceLanguage, desiredLanguage } = req.body;
        const validLanguages = ["python", "javascript", "java", "c", "csharp", "cplusplus", "php", "go", "ruby", "typescript"];

        if (!user_id || !inputCode || !translateCode || typeof inputCode !== 'string' || typeof translateCode !== 'string'
            || !sourceLanguage || !desiredLanguage || !validLanguages.includes(sourceLanguage) || !validLanguages.includes(desiredLanguage)) {
            return res.status(400).json({ error: 'Missing required fields to post or invalid input' });
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
    } catch (error) {
        // console.error("Error posting history:", error);
        logger.error(`Error: ${error.message}, Location: backend/controllers/historyControllers.js`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.getAllHistory = getAllHistory
module.exports.postHistory = postHistory
module.exports.deleteHistory = deleteHistory