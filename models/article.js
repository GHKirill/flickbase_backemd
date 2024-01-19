const mongoose = require("mongoose");
const { ApiError } = require("../middleware/apiError");
const httpStatus = require("http-status");

const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

require("dotenv").config();

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: 100,
    required: [true, "You need a title"],
  },
  content: {
    type: String,
    // maxLength: 100,
    required: [true, "You need a content"],
  },
  excerpt: {
    type: String,
    maxLength: 500,
    required: [true, "You need a excerpt"],
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  actors: {
    type: [String],
    required: true,
    // validate: {
    //   validator: function (array) {
    //     return array.length >= 2;
    //   },
    //   message: "You must add min three actors",
    // },
    validate(array) {
      if (array?.length < 3) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "You must add min three actors"
        );
      }
    },
  },
  status: {
    type: String,
    required: true,
    enum: ["draft", "public"],
    default: "draft",
    index: true, //find or sort by index ??????/
  },
  category: {
    //type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

articleSchema.plugin(aggregatePaginate);

const Article = mongoose.model("Article", articleSchema);

module.exports = { Article };
