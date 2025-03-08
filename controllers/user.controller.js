const User = require("../models/user.model");
const { log_error } = require("../utils/logger");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    log_error("[GET_USERS_ERROR] " + error.stack.split("\n").join("\n\t"));
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    log_error("[GET_USER_ERROR] " + error.stack.split("\n").join("\n\t"));
    next(error);
  }
};
