const httpStatus = require("http-status");
const { authService, emailService } = require("../services");

const authController = {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await authService.createUser(email, password);

      const token = authService.genAuthToken(user);

      //SEND VERIFICATION EMAIL
      await emailService.registerEmail(email, user);

      res
        .cookie("x-access-token", token)
        .status(httpStatus.CREATED)
        .json({ user, token });
    } catch (error) {
      //res.status(httpStatus.BAD_REQUEST).send(error.message);
      next(error);
    }
  },

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await authService.signInWithEmailAndPassword(
        email,
        password
      );
      const token = authService.genAuthToken(user);
      return res
        .cookie("x-access-token", token)
        .status(httpStatus.OK)
        .json({ user, token });
    } catch (error) {
      //res.status(httpStatus.BAD_REQUEST).send(error.message);
      next(error);
    }
  },

  async isAuth(req, res, next) {
    res.send(req.user);
  },

  // async testRole(req, res, next) {
  //   res.send(req.user);
  // },
};

module.exports = authController;
