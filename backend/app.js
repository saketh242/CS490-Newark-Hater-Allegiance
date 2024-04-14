// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require("./routes/userRoutes");
const historyRouter = require("./routes/historyRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");
const chatGptRouter = require("./routes/chatGptRouter");
const issueRouter = require("./routes/issueRoutes");
const decodeToken = require("./middleware/index");
const sendErrorLogEmail = require('./logs/notifyDevs');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const queue = require('express-queue');

// express-rate-limit --> limits each IP to 100 requests per 15 mins :), 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: "Rate limit exceeded, only 100 requests allowed per 15 minutes"
});

app.use(cors());
app.use(limiter);
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use(express.json());
app.use(mongoSanitize()); //sanitize all user input
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

// Schedule the cron job to run at 8 AM when app running
// should go off at 9pm
cron.schedule('28 10 * * *', async () => {
  console.log("Sending email");
  sendErrorLogEmail();
}, {
  timezone: 'America/New_York'
});

mongoose.connect(process.env.DATABASE)
  .then(() => {
    console.log("MongoDB connection successful :)");
    // Start the server only if MongoDB connection is successful
    const server = app.listen(8000, () => {
      console.log("Server Started on port 8000...");
    });

    // Handle termination signals and close MongoDB connection
    process.on('SIGINT', () => {
      mongoose.connection.close(); // No callback needed
      console.log('MongoDB connection closed through app termination');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("MongoDB connection unsuccessful :(", err);
  });

app.use("/users", decodeToken, userRouter);
app.use("/history", decodeToken, historyRouter);
app.use("/feedback", feedbackRouter);
app.use("/openAI", decodeToken, chatGptRouter)
app.use("/issues", issueRouter);

app.get("/test", (req, res) => {
    res.status(200).json({ message: "This is a test for auth" });
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to NHA CS490!")
});

app.get("*", (req, res, next) => {
    res.status(404).send("Not Found");
});

module.exports = app;