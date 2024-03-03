require('dotenv').config()
const express = require("express");
const cors = require("cors")
const app = express()
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes")
const historyRouter = require("./routes/historyRoutes")
const feedbackRouter = require("./routes/feedbackRoutes")
const decodeToken = require("./middleware/index")

app.use(express.json());
app.use(cors()); // Corrected line
mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log("MongoDB connection successful :)")
    }).catch((err) => {
        console.log(err)
        console.log("MongoDB connection unsuccessful :(")
    })

app.use("/users", decodeToken, userRouter);
app.use("/history", decodeToken, historyRouter);
app.use("/feedback", feedbackRouter);

app.get("/test", (req, res) => {
    // console.log(req)
    res.json({message:"This is test for auth"})
})

app.get("*", (req, res, next) => {
    res.send("Welcome to NHA CS490 project!");
})

app.listen(3000, (req, res, next) => {
    console.log("Server Started on port 3000...");
})
