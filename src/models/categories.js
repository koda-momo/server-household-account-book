const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = Schema({
  id: String,
  name: String,
  icon: String,
  color: String,
  genre: String,
});

module.exports = mongoose.model("Category", CategorySchema);
