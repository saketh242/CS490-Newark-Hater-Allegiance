const axios = require('axios');
const OpenAIApi = require('openai');

const openai = new OpenAIApi.OpenAI({ key: process.env.OPENAI_API_KEY });

const postPrompt = async (req, res, next) => {
    const { inputCode, sourceLanguage, desiredLanguage } = req.body;
    const prompt = `Translate the following ${sourceLanguage} code to ${desiredLanguage} and provide only the ${desiredLanguage} code:\n\n\`\`\`${inputCode}\n\`\`\``;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
        });
        //console.log(response)
        if (!(response && response.choices && response.choices.length > 0)) {
            throw new Error("Unexpected response from OpenAI API");
        }

        const translatedCode = response.choices[0].message.content;

        // Remove triple backticks
        const filtered = translatedCode.replace(/```/g, '');

        const code = filtered.split('\n').slice(1).map(line => line.trim()).join('\n');
        return res.status(200).json({
            success: true,
            message: code,
        });
    } catch (error) {
        console.log("Error message: ", error);

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: "API rate limit exceeded. Please try again later.",
            });
        } else if (error.status === 503) {
            return res.status(503).json({
                success: false,
                message: "OpenAI API temporarily unavailable. Please try again later.",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "An error occurred while processing your request. Please see API availability or try again.",
            });
        }
    }
};

module.exports.postPrompt = postPrompt;