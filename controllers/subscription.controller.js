const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");
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
const getAllSubscriptions = async (req, res, next) => {
  try {
    console.log("All Req new =>", req.headers);
    const allSubs = await Subscription.find();

    res.status(200).json({ success: true, data: allSubs });
  } catch (error) {
    log_error(
      "[GET_ALL_SUBSCRIPTIONS] " + error.stack.split("\n").join("\n\t")
    );
    next(error);
  }
};

const getSingleSubscription = async (req, res, next) => {
  try {
    console.log("All Req =>", req.headers);
    console.log("All url =>", req.url, { id: req.params.id });
    if (!req.params.id) {
      const error = new Error("Subscription id is not provided");
      error.status = 401;
      throw error;
    }
    const singleSubs = await Subscription.findById(req.params.id);
    if (!singleSubs) {
      const error = new Error("Subscription is not found");
      error.status = 401;
      throw error;
    }
    res.status(200).json({ success: true, data: singleSubs });
  } catch (error) {
    log_error(
      "[GET_SINGLE_SUBSCRIPTION] " + error.stack.split("\n").join("\n\t")
    );
    next(error);
  }
};
module.exports = {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSingleSubscription,
};
