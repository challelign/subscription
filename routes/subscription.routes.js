const { Router } = require("express");
const {
  createSubscription,
  getUserSubscriptions,
  getSingleSubscription,
  getAllSubscriptions,
} = require("../controllers/subscription.controller");
const { authorize } = require("../middlewares/auth.middleware");

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, createSubscription);
subscriptionRouter.get("/all-subscription", authorize, getAllSubscriptions);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.get("/:id", authorize, getSingleSubscription);

module.exports = subscriptionRouter;
