const mongoose = require('mongoose');
const User = require("./User")


const feedbackSchema = new mongoose.Schema({
  textMessage: { type: String, required: true },
  TranslationRating: { type: Number, required: true, min: 1, max: 5 },
  UXRating: { type: Number, required: true, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: { type: mongoose.Schema.Types.ObjectId, ref: 'History', required: true },
});

const FeedBack = mongoose.model('FeedBack', feedbackSchema);

module.exports = FeedBack;