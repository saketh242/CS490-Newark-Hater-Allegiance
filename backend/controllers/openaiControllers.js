const OpenAIApi = require('openai');
const logger = require('../logs/logger');

const openai = new OpenAIApi.OpenAI({ key: process.env.OPENAI_API_KEY });
const openai2 = new OpenAIApi.OpenAI({ key: process.env.OPENAI_API_KEY2 });

const detectLanguage = async (code) => {
    const prompt = `
    [no prose] what language is the following code:

    \`\`\`${code}
    \`\`\`
    
    please respond with one of the following languages and only say the language: ["python", "javascript", "java", "c", "csharp", "cplusplus", "php", "go", "ruby", "typescript"]`;

    const response = await openai2.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            { role: "system", content: "You are a helpful assistant who's job is to detect the language of input code!" },
            { role: "user", content: prompt }
        ],
    });

    if (!(response && response.choices && response.choices.length > 0)) {
        throw new Error("Unexpected response from OpenAI API");
    }
    console.log(response.choices[0].message.content)
    return response.choices[0].message.content;
};

const postPrompt = async (req, res, next) => {
    const { inputCode, sourceLanguage, desiredLanguage } = req.body;

    try {
        const detectedSourceLanguage = await detectLanguage(inputCode);

        if (detectedSourceLanguage !== sourceLanguage) {
            throw new Error("Input code does not match specified source language");
        }

        const prompt = `
        [no prose] Translate the following ${sourceLanguage} code to ${desiredLanguage} and provide only the full ${desiredLanguage} code:

        \`\`\`${inputCode}
        \`\`\``;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "system", content: "You are a helpful assistant who's job is to convert code from one language!" },
                { role: "user", content: prompt }
            ],
        });

        if (!(response && response.choices && response.choices.length > 0)) {
            throw new Error("Unexpected response from OpenAI API");
        }

        const translatedCode = response.choices[0].message.content;

        const filtered = translatedCode.replace(/```/g, '');
        const code = filtered.split('\n').slice(1).join('\n').trim();
        return res.status(200).json({
            success: true,
            message: code,
        });
    } catch (error) {
        logger.error(`Error: ${error.message}, Input: ${inputCode}, SourceLanguage: ${sourceLanguage}, DesiredLanguage: ${desiredLanguage}`);

        let statusCode = 500;
        let errorMessage = "An error occurred while processing your request. Please try again.";

        if (error.message === "Input code does not match specified source language") {
            statusCode = 400;
            errorMessage = error.message;
        } else if (error.status === 429) {
            statusCode = 429;
            errorMessage = "API rate limit exceeded. Please try again later.";
        } else if (error.status === 503) {
            statusCode = 503;
            errorMessage = "OpenAI API temporarily unavailable. Please try again later.";
        }

        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
        });
    }
};

module.exports.postPrompt = postPrompt;
