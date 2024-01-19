const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { xss } = require("express-xss-sanitizer");
const mongoSanitize = require("express-mongo-sanitize");

const passport = require("passport");
const { jwtStrategy } = require("./middleware/passport.js");

const { handleError, convertToApiError } = require("./middleware/apiError.js");

require("dotenv").config();

const routes = require("./routes");

const app = express();

//PASSPORT
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

//PARSING
//
app.use(bodyParser.json());

//SANITIZE
app.use(xss());
app.use(mongoSanitize());

//ROUTES
app.use("/api", routes);

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3001;

//ERROR HANDLING
app.use((err, req, res, next) => convertToApiError(err, req, res, next));
app.use((err, req, res, next) => handleError(err, req, res, next));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ...`);
  mongoose
    .connect(mongoUri)
    .then((res) => console.log("connection to DB is successful"));
});
