const router = require("express").Router();

//routes

const authRoute = require("./auth.route");
const articlesRoute = require("./articles.route");
const userRoute = require("./user.route");

const routesIndex = [
  { path: "/auth", route: authRoute },
  { path: "/articles", route: articlesRoute },
  { path: "/user", route: userRoute },
];

routesIndex.forEach((route) => router.use(route.path, route.route));

module.exports = router;
