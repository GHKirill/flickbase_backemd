const httpStatus = require("http-status");
const User = require("../models/user");
const { ApiError } = require("../middleware/apiError");

const createUser = async (email, password) => {
  try {
    if (await User.emailTaken(email)) {
      //throw new Error("Sorry email taken");
      throw new ApiError(httpStatus.BAD_REQUEST, "Sorry email taken");
    }

    const user = await new User({ email, password });

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const genAuthToken = (user) => {
  const token = user.generateToken();
  return token;
};

const signInWithEmailAndPassword = async (email, password) => {
  try {
    //CHECK EMAIL EXISTS
    const user = await User.findUserByEmail(email);

    if (!user) {
      // throw new Error("Sorry Wrong email");
      throw new ApiError(httpStatus.BAD_REQUEST, "Sorry wrong email");
    }
    //CHECK CORRECT PASSWORD
    const checkPasswordResult = await user.checkPassword(password);
    if (!checkPasswordResult) {
      // throw new Error("Sorry wrong password");
      throw new ApiError(httpStatus.BAD_REQUEST, "Sorry wrong password");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, genAuthToken, signInWithEmailAndPassword };
