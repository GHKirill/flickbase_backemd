const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../middleware/apiError");
const User = require("../models/user");
require("dotenv").config();

const findUserById = async (id) => {
  try {
    const user = await User.findUserById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (req) => {
  try {
    const { firstname, lastname, age } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $set: { firstname, lastname, age } },
      { new: true }
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserEmail = async (req) => {
  try {
    // const user = await User.findUserById(id);
    // if (!user) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    // }
    const { user: userRequest } = req;
    const { newemail } = req.body;
    if (!newemail) {
      throw new ApiError(httpStatus.BAD_REQUEST, "New email was not sent");
    }
    const emailTaken = await User.emailTaken(newemail);
    if (emailTaken) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Current email is already used"
      );
    }
    //console.log("id_: ", userRequest._id, "email: ", userRequest.email);
    const user = await User.findOneAndUpdate(
      { email: userRequest.email },
      { $set: { email: newemail, verified: false } },
      { new: true }
    );
    //console.log(user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const validateToken = (token) => {
  return jwt.verify(token, process.env.DB_SECRET);
};

module.exports = {
  findUserById,
  updateUserProfile,
  updateUserEmail,
  validateToken,
};
