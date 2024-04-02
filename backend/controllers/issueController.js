const sendUserIssuesEmail = require('../logs/userEmails');

const emailDev = async (req, res, next) => {
    const{name, email, message} = req.body;
    try{
        sendUserIssuesEmail(name, email, message);
    }
    catch (error){
        console.log(error);
        res.status(500).json({error: 'Error sending contact us email'});
    }
}

module.exports.emailDev = emailDev;