const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");

const { check, validationResult } = require("express-validator");

const articleValidator = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("You need add a title")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum of 3 is required"),
  check("director")
    .trim()
    .not()
    .isEmpty()
    .withMessage("You need add a Director")
    .bail()
    .not()
    .isBoolean()
    .withMessage("You cannot add a bool here")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Please check size")
    .bail(),
  check("actors")
    .isArray({ min: 3 })
    .withMessage("Number of actors is 3 as a minimum")
    .bail(),
  (req, res, next) => {
    ///
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ApiError(httpStatus.BAD_REQUEST, { errors: errors.array() }));
    }
    ///
    next();
  },
];

module.exports = { articleValidator };
