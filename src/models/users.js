const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  id: String,
  name: String,
  mail: String,
  password: String,
  image: String,
  familyId: String,
  role: String,
  color: String,
  //カテゴリごと
  incomeId: [{ type: Schema.Types.ObjectId, ref: "Income" }],
  spendingId: [{ type: Schema.Types.ObjectId, ref: "Spending" }],
});

module.exports = mongoose.model("User", UserSchema);
