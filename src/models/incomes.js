const mongoose = require("mongoose");
const { Schema } = mongoose;

const IncomeSchema = mongoose.Schema({
  id: String,
  categoryName: String,
  color: String,
  icon: String,
  total: Number,
  userId: String,
  incomeId: [{ type: Schema.Types.ObjectId, ref: "IncomeItem" }],
  createdAt: Date,
});

module.exports = mongoose.model("Income", IncomeSchema);
