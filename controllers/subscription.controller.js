const { SERVER_URL } = require("../config/env");
const { workflowClient } = require("../config/upstash");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");
const { log_error } = require("../utils/logger");
const { sendReminderEmail } = require("../utils/send-email");

const createSubscription = async (req, res, next) => {
  try {
    // OPTION ONE
    /*     
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
      const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
 */

    // OPTION TWO START
    let subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    // re-fetch the subscription with populated user details
    subscription = await Subscription.findById(subscription._id).populate(
      "user"
    );
    // OPTION TWO END

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    // OPTION ONE
    /*     
    if (subscription.status === "active") {
      await sendReminderEmail({
        to: user.email,
        type: "thank_you",
        subscription: {
          ...subscription.toObject(), // convert Mongoose doc to plain object
          user, // inject full user info
        },
      });
    }
 */
    // OPTION TWO START
    if (subscription.status === "active") {
      await sendReminderEmail({
        to: subscription.user.email,
        type: "thank_you",
        subscription,
      });
    }
    // OPTION TWO END

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
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
