const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model.js");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env.js");
const { log_error } = require("../utils/logger.js");

const signUp = async (req, res, next) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { name, username, email, password } = req.body;

    // Check if a user already exists by using email or username
    const existingUser = await User.findOne({
      $or: [{ email: email || undefined }, { username: username || undefined }],
    });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, username, password: hashedPassword }]
      // { session }
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    log_error("[SIGN_UP] " + error.stack.split("\n").join("\n\t"));

    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Check if a user already exists by using email or username
    const user = await User.findOne({
      $or: [{ email: email || undefined }, { username: username || undefined }],
    });

    // const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    log_error("[SIGN_IN] " + error.stack.split("\n").join("\n\t"));

    next(error);
  }
};

const signOut = async (req, res, next) => {};

module.exports = { signUp, signIn, signOut };
