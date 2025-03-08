const { Router } = require("express");
const { getUsers } = require("../controllers/user.controller");

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.post("/", (req, res) => res.send({ title: "CREATE new user" }));

userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE user" }));

userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE user" }));

module.exports = userRouter;
