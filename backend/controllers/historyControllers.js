const History = require("../models/History")
const logger = require('../logs/logger');

const getAllHistory = async (req, res, next) => {
    try {
        const { user_id, ascend, sortField } = req.query;
        const fieldMapping = {
            "Date": "createdAt",
            "": "createdAt",
            "Source": "Source_language",
            "Destination": "Desired_language",
          };
        const sortFieldInDB = fieldMapping[sortField];
        const sortObject = {};
        sortObject[sortFieldInDB] = Number(ascend);
        console.log(sortObject);
        if (!user_id) {
            return res.status(400).json({ error: 'Missing required field to get history' });
        }
        const histories = await History.find({ user: user_id })
            .select('_id Desired_language Source_language original_code converted_code createdAt')
            .sort(sortObject);
        res.status(200).send(histories);
    } catch (error) {
        // console.error("Error fetching all users:", error);
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