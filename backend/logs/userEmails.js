const nodemailer = require('nodemailer');

function sendUserIssuesEmail(username, useremail, usermessage) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nhagptupdates@gmail.com',
      pass: process.env.NHAUPDATES_PASS
    }
  });

  const mailOptions = {
    from: 'nhagptupdates@gmail.com',
    to: 'nhagpt490@gmail.com',
    subject: `Contact Us Form - ${useremail} `,
    text: `From: ${username}, ${useremail}:\n\n${usermessage}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendUserIssuesEmail;
