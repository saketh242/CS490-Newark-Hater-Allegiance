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
const decodeToken = require("./middleware/index");

app.use(express.json());
app.use(cors());
app.use(mongoSanitize());

mongoose.connect(process.env.DATABASE)
  .then(() => {
    console.log("MongoDB connection successful :)");
    // Start the server only if MongoDB connection is successful
    const server = app.listen(8000, () => {
      console.log("Server Started on port 8000...");
    });

    // Handle termination signals and close MongoDB connection
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('MongoDB connection closed through app termination');
        server.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
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
