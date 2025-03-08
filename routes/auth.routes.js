const { Router } = require("express");

const { signUp, signIn, signOut } = require("../controllers/auth.controller");
const { validateRequestBody } = require("../middlewares/validation.middleware");
const authRouter = Router();

authRouter.post(
  "/sign-up",
  validateRequestBody(["name", "username", "email", "password"]),
  signUp
);
authRouter.post("/sign-in", validateRequestBody(["password"]), signIn); // Only require password,but email or username will be handled in validation
authRouter.post("/sign-out", signOut);

module.exports = authRouter;
