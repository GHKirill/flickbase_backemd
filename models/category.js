const mongoose = require("mongoose");

require("dotenv").config();

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    maxLength: 100,
    required: [true, "You need a category name"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
