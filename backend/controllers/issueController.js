const sendUserIssuesEmail = require('../logs/userEmails');
const logger = require('../logs/logger');

const emailDev = async (req, res, next) => {
    const{name, email, message} = req.body;
    try{
        sendUserIssuesEmail(name, email, message);
        res.status(200).json({msg:"Email Sent successfully"});
    }
    catch (error){
        // console.log(error);
        res.status(500).json({error: 'Error sending contact-us email'});
        logger.error(`Error: error sending contact-us email, ${error.message}, 
        Location: backend/controllers/issueController.js`);

    }
}

module.exports.emailDev = emailDev;