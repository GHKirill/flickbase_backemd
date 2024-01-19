const router = require("express").Router();
const articlesController = require("../controllers/articles.controller");
const { articleValidator } = require("../middleware/validation");
const {
  articleCreateValidation,
} = require("../middleware/validation.createArticle");
const {
  articleUpdateValidation,
} = require("../middleware/validation.updateArticle");

const auth = require("../middleware/auth");

//articles

router.post(
  "/",
  auth("createAny", "articles"),
  articleCreateValidation,
  articlesController.createArticle
);

router
  .route("/article/:id")
  .get(auth("readAny", "articles"), articlesController.getArticleById)
  .patch(
    auth("updateAny", "articles"),
    articleUpdateValidation,
    articlesController.updateArticleById
  )
  .delete(auth("deleteAny", "articles"), articlesController.deleteArticleById);

router.route("/users/article/:id").get(articlesController.getUsersArticleById);

router
  .route("/all")
  .get(articlesController.getAllArticles)
  .post(articlesController.getMoreArticles);

router.post(
  "/admin/paginate",
  auth("readAny", "articles"),
  articlesController.adminPaginateArticles
);

//auth("readAll", "articles")
//Categories

router
  .route("/categories")
  .post(auth("createAny", "categories"), articlesController.createCategory)
  .get(auth("readAny", "categories"), articlesController.getAllCategories);

module.exports = router;
