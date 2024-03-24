const fs = require('fs');
const nodemailer = require('nodemailer');

// Function to send email with error log attachment
function sendErrorLogEmail() {
  // Read the error log file
  const errorLogPath = '/home/medina/NHAGPT/CS490-Newark-Hater-Allegiance/backend/logs/error.log';
  const errorLog = fs.readFileSync(errorLogPath, 'utf8');

  // Filter errors logged within the last 24 hours
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
  const recentErrors = errorLog
    .split('\n')
    .filter(line => {
      try {
        const logObject = JSON.parse(line);
        const logDate = new Date(logObject.timestamp);
        return logDate > twentyFourHoursAgo;
      } catch (error) {
        console.error('Error parsing log entry:', error);
        return false;
      }
    })
    .join('\n');

  // Write recent errors to a new file
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const newErrorLogPath = `/home/medina/NHAGPT/CS490-Newark-Hater-Allegiance/backend/logs/NHAGPT-${currentDate}-error-log.txt`;
  fs.writeFileSync(newErrorLogPath, recentErrors, 'utf8');

  // Compose email with the error log file as an attachment
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'med.dzhatdo@gmail.com',
      pass: 'mqtl iobt sisn iwzq'
    }
  });

  const mailOptions = {
    from: 'med.dzhatdo@gmail.com',
    to: 'nhagpt490@gmail.com',
    subject: `NHAGPT Error Log Report - ${currentDate}`,
    text: `Please find attached the NHAGPT error log for ${currentDate}.`,
    attachments: [
      {
        filename: `NHAGPT-${currentDate}-error-log.txt`,
        path: newErrorLogPath
      }
    ]
  };

  // Send email with attachment
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
      // Delete the created file after email is sent
      fs.unlinkSync(newErrorLogPath);
      console.log('File deleted:', newErrorLogPath);
    }
  });
}

module.exports = sendErrorLogEmail;
