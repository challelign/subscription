const Subscription = require("../models/subscription.model");
const { log_error } = require("../utils/logger");

const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    log_error("[CREATE_SUBSCRIPTION] " + error.stack.split("\n").join("\n\t"));
    next(error);
  }
};

const getUserSubscriptions = async (req, res, next) => {
  try {
    console.log("[rqid", req.params.id);
    // CHECK IF THE USER IS THE SAME AS THE ONE IN THE TOKEN
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subs = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subs });
  } catch (error) {
    log_error(
      "[GET_USER_SUBSCRIPTION] " + error.stack.split("\n").join("\n\t")
    );
    next(error);
  }
};

module.exports = { createSubscription, getUserSubscriptions };
