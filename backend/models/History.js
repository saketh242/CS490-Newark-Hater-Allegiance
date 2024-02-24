const mongoose = require('mongoose');
const User = require("./User")


const historySchema = new mongoose.Schema({
  original_code: { type: String, required: true },
  language: { type: String, required: true },
  converted_code: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const History = mongoose.model('History', historySchema);

module.exports = History;