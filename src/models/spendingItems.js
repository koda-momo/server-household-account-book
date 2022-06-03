const mongoose = require("mongoose");

const SpendingItemSchema = mongoose.Schema({
  id: String,
  name: String,
  howmatch: Number,
  createdAt: Date,
});

module.exports = mongoose.model("SpendingItem", SpendingItemSchema);
