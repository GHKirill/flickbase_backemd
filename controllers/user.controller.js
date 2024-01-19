const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");
const { userService, authService, emailService } = require("../services");

const userController = {
  async profile(req, res, next) {
    try {
      const user = await userService.findUserById(req.user._id);

      //SEND ONLY FIELDS FROM 'ROLE' FILE

      const filteredRes = res.locals.permission.filter({
        ...user._doc,
        _id: user._doc._id.toHexString(),
      });

      res.status(httpStatus.OK).json(filteredRes);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateUserProfile(req);

      const filteredRes = res.locals.permission.filter({
        ...user._doc,
        _id: user._doc._id.toHexString(),
      });

      res.status(httpStatus.OK).json(filteredRes);
    } catch (error) {
      next(error);
    }
  },

  async updateUserEmail(req, res, next) {
    try {
      const user = await userService.updateUserEmail(req);
      //
      // token
      const token = authService.genAuthToken(user);

      //sending email
      await emailService.registerEmail(user.email, user);

      //send response ( with new token)
      const filteredRes = res.locals.permission.filter({
        ...user._doc,
        _id: user._doc._id.toHexString(),
      });

      res
        .cookie("x-access-token", token)
        .status(httpStatus.OK)
        .json({ user: filteredRes });
    } catch (error) {
      next(error);
    }
  },

  async verifyAccount(req, res, next) {
    try {
      const token = userService.validateToken(req.query.validation);

      const user = await userService.findUserById(token?.sub);

      if (user.verified) {
        throw new ApiError(httpStatus.NOT_FOUND, "Already verified");
      }

      user.verified = true;
      user.save();

      res
        .status(httpStatus.CREATED)
        .send({ email: user.email, verified: user.verified });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
