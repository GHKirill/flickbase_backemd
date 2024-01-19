const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");

const { Category } = require("../models/category");
const { Article } = require("../models/article");

require("dotenv").config();

const addArticle = async (body) => {
  try {
    //
    const article = new Article({ ...body, score: parseInt(body.score) });
    await article.save();
    return article;
    //
  } catch (error) {
    throw error;
  }
};

const getArticleById = async (id, user) => {
  try {
    if (user.role === "user") {
      throw new ApiError(httpStatus.BAD_REQUEST, "not authorized");
    }
    const article = await Article.findById(id).populate("category", "name");
    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, "article not found");
    }

    return article;
  } catch (error) {
    throw error;
  }
};

const updateArticleById = async (_id, body) => {
  try {
    const article = await Article.findByIdAndUpdate(
      { _id },
      { ...body },
      { new: true }
    ).populate("category", "name");
    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, "article not found");
    }

    return article;
  } catch (error) {
    throw error;
  }
};

const deleteArticleById = async (id) => {
  try {
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, "article not found");
    }

    return article;
  } catch (error) {
    throw error;
  }
};

const getUsersArticleById = async (id) => {
  try {
    const article = await Article.findById(id).populate("category", "name");
    if (!article) throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    if (article.status === "draft")
      throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized");

    return article;
  } catch (error) {
    throw error;
  }
};

const getAllArticles = async (req) => {
  // ghgh?sortby=_id&order=desc&limit=3&skip=1
  let { sortby, order, limit, skip } = req.query;
  sortby = sortby || "_id";
  //order = order === "asc" ? 1 : -1;
  order = order || "desc";
  limit = limit || 5;
  skip = skip || 0;

  try {
    const articles = await Article.find(
      { status: "public" },
      //{},
      //["title", "actors", "category"],
      null,
      {
        skip: skip,
        limit: limit,
        sort: { [sortby]: order },
      }
    ).populate("category", "name");

    return articles;
  } catch (error) {
    throw error;
  }
};

const getMoreArticles = async (req) => {
  let { sortby, order, limit, skip } = req.body;
  sortby = sortby || "_id";
  order = order || "desc";
  limit = limit || 3;
  skip = skip || 0;
  try {
    //const articles = await Article.find({ status: "public" }, ["title", "actors", "category"])
    // const articles = await Article.find({})
    //   .populate("category", "name")
    //   .sort([[sortby, order]])
    //   .skip(skip)
    //   .limit(limit);

    const articles = await Article.find(
      //{ status: "public" },
      {},
      //["title", "actors", "category"],
      null,
      {
        skip: skip,
        limit: limit,
        sort: { [sortby]: order },
      }
    ).populate("category", "name");

    return articles;
  } catch (error) {}
};

const adminPaginateArticles = async (req) => {
  let aggQueryArray = [];
  //let aggQuery;
  if (req.body.keyword && req.body.keyword !== "") {
    const re = new RegExp(`${req.body.keyword}`, "gi");
    //aggQuery = Article.aggregate([{ $match: { title:  } }]);
    aggQueryArray.push({
      $match: { title: { $regex: re } },
    });
  }

  /// Categories
  aggQueryArray.push(
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" }
  );

  const page = req.body.page || 1;
  const limit = req.body.limit || 4;
  sortby = req.body.sortby || "_id";
  order = req.body.order || "desc";

  //const {page=1, limit=4, sortby='_id', order='desc'} = req.body;

  const options = {
    page,
    limit,

    sort: { [sortby]: order },
    // populate: { path: "category" },
  };

  try {
    // const user = await Article.findById(req.user._id);
    // console.log(req.user);
    if (req.user.role === "user") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "sorry, you are not authorized"
      );
    }
    const aggQuery = Article.aggregate(aggQueryArray);

    const result = await Article.aggregatePaginate(aggQuery, options);
    // const popul = Article.populate(result, {pat});
    return result;
  } catch (error) {
    throw error;
  }
};

const addCategory = async (body) => {
  try {
    //validation

    console.log(body);
    const category = new Category(body);
    await category.save();
    return category;
  } catch (error) {
    throw error;
  }
};

const findAllCategories = async (req, res, next) => {
  const categories = await Category.find({});
  return categories;
};

module.exports = {
  addArticle,
  addCategory,
  findAllCategories,
  getArticleById,
  updateArticleById,
  deleteArticleById,
  getUsersArticleById,
  getAllArticles,
  getMoreArticles,
  adminPaginateArticles,
};
