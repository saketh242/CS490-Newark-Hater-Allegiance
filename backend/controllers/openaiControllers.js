const OpenAIApi = require('openai');
const logger = require('../logs/logger');

const openai = new OpenAIApi.OpenAI({ key: process.env.OPENAI_API_KEY });

const detectLanguage = async (code) => {
    const prompt = `
    [no prose] what language is the following code:

    \`\`\`${code}
    \`\`\`
    
    please respond with one of the following languages and only say the language: ["python", "javascript", "java", "c", "csharp", "cplusplus", "php", "go", "ruby", "typescript"]`;

    const response = await openai.chat.completions.create({
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
        \`\`\`
        
        If the source language is not recognized or supported, or if the input code contradicts the specified ${sourceLanguage} language, please output "Language does not match", and do not proceed with the translation`;

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

        if (translatedCode.includes('Language does not match')) {
            throw new Error("Input code does not match specified source language");
        }

        const filtered = translatedCode.replace(/```/g, '');
        const code = filtered.split('\n').slice(1).join('\n').trim();

        return res.status(200).json({
            success: true,
            message: code,
        });
    } catch (error) {
        logger.error(`Error: ${error.message}, Input: ${inputCode}, SourceLanguage: ${sourceLanguage}, DetectedLanguage: "AHHHHH", DesiredLanguage: ${desiredLanguage}`);

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

/*
const axios = require('axios');
const OpenAIApi = require('openai');

const openai = new OpenAIApi.OpenAI({ key: process.env.OPENAI_API_KEY });

const postPrompt = async (req, res, next) => {
    const { inputCode, sourceLanguage, desiredLanguage } = req.body;
    //const prompt = 
    //`Please, Translate this input code: "${inputCode}" and convert it to the ${desiredLanguage}. If any part of the input code is not valid code written in any programming language, just return that portion of the input code as it is(not in quotes or any other things added just return it normally). If the input code has portions of valid code then convert and give me only the translated code in the ${desiredLanguage}(also, when converting the output code, it should look like it is written professionally do not try to convert word to word, do not try to fix any syntax errors, don't give me anything else just give me the output language code that's it) also for languages that require methods or classes to run please generate that too, please understand thank you`;
    const prompt = `
    [no prose] Translate the following ${sourceLanguage} code to ${desiredLanguage} and provide only the ${desiredLanguage} code:

    \`\`\`${inputCode}
    \`\`\`
    
    If the source language is not recognized or supported, or if the input code contradicts the specified ${sourceLanguage} language, please output "Language does not match", and do not proceed with the translation`;
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
        console.log(translatedCode);

        if (translatedCode.startsWith('Language does not match')) {
            // Language is oof
            return res.status(400).json({
                success: false,
                message: "Input code does not match language",
            });
        }
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
*/