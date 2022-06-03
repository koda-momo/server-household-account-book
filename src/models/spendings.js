const mongoose = require("mongoose");
const { Schema } = mongoose;

const SpendingSchema = mongoose.Schema({
  id: String,
  categoryName: String,
  color: String,
  icon: String,
  total: Number,
  userId: String,
  spendingId: [{ type: Schema.Types.ObjectId, ref: "SpendingItem" }],
  createdAt: Date,
});

module.exports = mongoose.model("Spending", SpendingSchema);
