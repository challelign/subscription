const express = require("express");
const cookieParser = require("cookie-parser");

const { PORT } = require("./config/env"); // Remove the .js extension
const userRouter = require("./routes/user.routes"); // Remove the .js extension
const authRouter = require("./routes/auth.routes"); // Remove the .js extension
const connectToDatabase = require("./database/mongodb"); // Remove the .js extension
const { log_error } = require("./utils/logger"); // Remove the .js extension
const { errorMiddleware } = require("./middlewares/error.middleware");
// const { arcjetMiddleware } = require("./middlewares/arcjet.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode =
    process.env.NODE_ENV === "development" ? err.statusCode || 500 : 200;
  const errStatusCode = err.statusCode || 500;

  const response = {
    status: false,
    message: "Internal Server Error",
  };

  res.status(statusCode).json(response);

  if (process.env.NODE_ENV === "development") {
    // Log the error stack to a file
    log_error(err.stack.split("\n").join("\n\t"));
  }
});
//url not found middleware
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `The API endpoint "${req.url}" with method "${req.method}" was not found.`,
  });
});

app.listen(PORT, async () => {
  console.log(
    `Subscription Tracker API is running on http://localhost:${PORT}`
  );

  await connectToDatabase();
});

module.exports = app;
