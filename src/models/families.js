const mongoose = require("mongoose");

const FamilySchema = mongoose.Schema({
  id: String,
  name: String,
  secretWord: String,
  password: String,
});

module.exports = mongoose.model("Family", FamilySchema);
