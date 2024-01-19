const passport = require("passport");
const httpStatus = require("http-status");
const { ApiError } = require("./apiError");

const { roles } = require("../config/roles");

const verify = (req, res, next, rights) => async (err, user) => {
  if (err || !user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Sorry, unauthorized"));
  }

  //CHECK ROLES
  if (rights.length) {
    const [action, resource] = rights;

    const permission = roles.can(user.role)[action](resource);
    if (!permission.granted) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "Sorry, YOU do not have enough rights"
        )
      );
    }
    //create in res only fields from 'roles' => not forbidden
    res.locals.permission = permission;
  }
  const { _id, email, role, firsname, lastname, verified } = user;
  req.user = { _id, email, role, firsname, lastname, verified };

  return next();
};

const auth =
  (...rights) =>
  async (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verify(req, res, next, rights)
    )(req, res, next);
  };

module.exports = auth;
