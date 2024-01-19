const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: { type: String, required: true, trim: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  firstname: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  lastname: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  age: { type: Number },
  date: {
    type: Date,
    default: Date.now(),
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

userSchema.static({
  emailTaken: async function (email) {
    try {
      const user = await this.findOne({ email });

      return !!user;
    } catch (error) {
      throw error;
    }
  },
  findUserByEmail: async function (email) {
    try {
      const user = await this.findOne({ email });

      return user;
    } catch (error) {
      throw error;
    }
  },
  findUserById: async function (id) {
    try {
      const user = await this.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  },
});

userSchema.method({
  generateToken: function () {
    const { _id, email } = this;

    const userObj = { sub: _id.toHexString(), email };

    return jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: "1d" });
  },

  generateRegisterToken: function () {
    const { _id, email } = this;

    const userObj = { sub: _id.toHexString() };

    return jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: "10h" });
  },

  checkPassword: async function (candidatePassword) {
    try {
      const checkResult = await bcrypt.compare(
        candidatePassword,
        this.password
      );
      return checkResult;
    } catch (error) {
      throw error;
    }
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
