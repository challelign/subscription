const { Router } = require("express");
const { getUsers, getUser } = require("../controllers/user.controller");
const { authorize } = require("../middlewares/auth.middleware");
const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => res.send({ title: "CREATE new user" }));

userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE user" }));

userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE user" }));

module.exports = userRouter;
