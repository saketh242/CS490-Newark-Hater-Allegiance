require('dotenv').config({ path: "../.env"})
const express = require("express");
const app = express()
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes")
const historyRouter = require("./routes/historyRoutes")
const feedbackRouter = require("./routes/feedbackRoutes")

app.use(express.json())

mongoose.connect(process.env.DATABASE)
    .then(()=>{
        console.log("MongoDB connection successful :)")
    }).catch((err)=>{
        console.log(err)
        console.log("MongoDB connection unsuccessful :(")
    })

app.use("/users", userRouter);
app.use("/history", historyRouter);
app.use("/feedback", feedbackRouter);

app.get("*", (req, res, next) => {
    res.send("Welcome to NHA CS490 project!");
})

app.listen(3000, (req, res, next) => {
    console.log("Server Started on port 3000...");
})