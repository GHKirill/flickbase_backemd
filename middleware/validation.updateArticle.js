const httpStatus = require("http-status");
const { ApiError } = require("./apiError");

const { checkSchema, validationResult } = require("express-validator");

const schema = {
  title: {
    in: ["body"],
    optional: { checkFalsy: true },
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
    optional: { checkFalsy: true },
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
    optional: { checkFalsy: true },
    isArray: { options: { min: 3 } },

    errorMessage: "Number of actors should be more than 3",

    custom: {
      options: (values) => {
        const unique_values = new Set(values);
        if (unique_values.size !== values.length) {
          //return Promise.reject();
          throw new Error();
        }
        //return Promise.resolve();
        return true;
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
    optional: { checkFalsy: true },
    isMongoId: {
      errorMessage: " invalid format id for category",
    },
  },
  status: {
    in: ["body"],
    //optional: { nullable: true, checkFalsy: true },
    optional: { checkFalsy: true },
    isString: { errorMessage: "status must be string" },
    isIn: {
      options: [["draft", "public"]],
      errorMessage: `allowed values for status are: ${["draft", "public"]}`,
    },
  },
  score: {
    in: ["body"],
    optional: { checkFalsy: true },
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

const articleUpdateValidation = [
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

module.exports = { articleUpdateValidation };

//https://stackoverflow.com/questions/71215274/checkschema-syntax-documentationa
