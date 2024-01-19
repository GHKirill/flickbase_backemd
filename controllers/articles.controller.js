const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");
const { articlesService } = require("../services");

const articlesController = {
  async createArticle(req, res, next) {
    try {
      const article = await articlesService.addArticle(req.body);
      res.status(httpStatus.CREATED).json(article);
    } catch (error) {
      next(error);
    }
  },

  async getArticleById(req, res, next) {
    try {
      const article = await articlesService.getArticleById(
        req.params.id,
        req.user
      );

      res.status(httpStatus.OK).send(article);
    } catch (error) {
      next(error);
    }
  },

  async updateArticleById(req, res, next) {
    try {
      const article = await articlesService.updateArticleById(
        req.params.id,
        req.body
      );
      res.status(httpStatus.OK).send(article);
    } catch (error) {
      next(error);
    }
  },

  async deleteArticleById(req, res, next) {
    try {
      const article = await articlesService.deleteArticleById(req.params.id);
      res.status(httpStatus.OK).send({ action: "deleted", id: article._id });
    } catch (error) {
      next(error);
    }
  },

  async getUsersArticleById(req, res, next) {
    try {
      const article = await articlesService.getUsersArticleById(req.params.id);

      res.status(httpStatus.OK).json(article);
    } catch (error) {
      next(error);
    }
  },

  async getAllArticles(req, res, next) {
    try {
      const articles = await articlesService.getAllArticles(req);

      res.status(httpStatus.OK).json(articles);
    } catch (error) {
      next(error);
    }
  },

  async getMoreArticles(req, res, next) {
    try {
      const articles = await articlesService.getMoreArticles(req);

      res.status(httpStatus.OK).json(articles);
    } catch (error) {
      next(error);
    }
  },

  async adminPaginateArticles(req, res, next) {
    try {
      const articles = await articlesService.adminPaginateArticles(req);

      res.status(httpStatus.OK).json(articles);
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const category = await articlesService.addCategory(req.body);
      res.status(httpStatus.CREATED).json(category);
    } catch (error) {
      next(error);
    }
  },

  async getAllCategories(req, res, next) {
    try {
      const categories = await articlesService.findAllCategories();
      res.status(httpStatus.OK).json(categories);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = articlesController;
