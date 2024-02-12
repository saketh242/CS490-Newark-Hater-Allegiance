const express = require("express");
const app = express()

app.get("*", (req, res, next) => {
    res.send("Welcome to NHA CS490 project!");
})

app.listen(3000, (req, res, next) => {
    console.log("Server Started on port 3000...");
})