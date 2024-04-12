const express = require("express");
const router = express.Router();
const { getAllHistory, postHistory, deleteHistory } = require("../controllers/historyControllers");

router.get("/getAllHistory", getAllHistory);

router.post("/", postHistory);

router.delete("/deleteHistory", deleteHistory);

module.exports = router;
