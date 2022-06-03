const mongoose = require("mongoose");

const IncomeItemSchema = mongoose.Schema({
  id: String,
  name: String,
  howmatch: Number,
  createdAt: Date,
});

module.exports = mongoose.model("IncomeItem", IncomeItemSchema);
