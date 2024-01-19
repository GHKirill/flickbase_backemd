const httpStatus = require("http-status");
const { ApiError } = require("./apiError");

const { check, checkSchema, validationResult } = require("express-validator");

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

const schema = {
  title: {
    in: ["body"],
    exists: {
      errorMessage: "title is required",
    },
    isString: { errorMessage: "The title must be string" },
    trim: true,
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage:
        "The title must be more than 3 chars an less than 100 chars",
    },
  },
  director: {
    in: ["body"],
    exists: {
      errorMessage: "director is required",
    },
    isString: { errorMessage: "Director must be string" },
    trim: true,
    isBoolean: { negated: true },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage:
        "The title must be more than 3 chars an less than 100 chars",
    },
  },
  actors: {
    in: ["body"],
    exists: {
      errorMessage: "actors is required",
    },
    isArray: { options: { min: 3 } },

    errorMessage: "Number of actors should be more than 3",

    custom: {
      options: (values) => {
        const unique_values = new Set(values);
        if (unique_values.size !== values.length) {
          return Promise.reject();
        }
        return Promise.resolve();
      },
      errorMessage: `you can't add duplicated`,
    },
    customSanitizer: {
      options: async (value, { req }) => {
        return value;
      },
    },
  },
  category: {
    in: ["body"],
    exists: { errorMessage: "category is required" },
    isMongoId: {
      errorMessage: " invalid format id for category",
    },
  },
  status: {
    in: ["body"],
    optional: { nullable: true, checkFalsy: true },
    isString: { errorMessage: "status must be string" },
    isIn: {
      options: [["draft", "public"]],
      errorMessage: `allowed values for status are: ${["draft", "public"]}`,
    },
  },
  score: {
    in: ["body"],
    exists: { errorMessage: "category is required" },
    custom: {
      options: async (value) => {
        const score = parseInt(value);
        if (score >= 0 && score <= 100) {
          // return Promise.resolve();
          return true;
        }
        //return Promise.reject();
        throw new Error();
      },
      errorMessage: `score value should be more than 0 and less than 100`,
    },
  },
};

const articleCreateValidation = [
  checkSchema(schema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(httpStatus.BAD_REQUEST, {
        errors: errors.mapped(),
      });
    }
    next();
  },
];

module.exports = { articleValidator, articleCreateValidation };

//https://stackoverflow.com/questions/71215274/checkschema-syntax-documentationa
