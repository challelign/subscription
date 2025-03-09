const { Router } = require("express");
const {
  createSubscription,
  getUserSubscriptions,
} = require("../controllers/subscription.controller");
const { authorize } = require("../middlewares/auth.middleware");

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, createSubscription);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.get("/:id", (req, res) =>
  res.send({ title: "GET subscription details" })
);

subscriptionRouter.put("/:id", (req, res) =>
  res.send({ title: "UPDATE subscription" })
);

subscriptionRouter.delete("/:id", (req, res) =>
  res.send({ title: "DELETE subscription" })
);

subscriptionRouter.put("/:id/cancel", (req, res) =>
  res.send({ title: "CANCEL subscription" })
);

subscriptionRouter.get("/upcoming-renewals", (req, res) =>
  res.send({ title: "GET upcoming renewals" })
);

module.exports = subscriptionRouter;
