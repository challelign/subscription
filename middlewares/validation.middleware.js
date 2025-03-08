const { NODE_ENV } = require("../config/env");

exports.validateRequestBody = (requiredBodyParams) => (req, res, next) => {
  const { body } = req;
  console.log("[requiredBodyParams]", body);
  const missingParams = requiredBodyParams.filter((param) => !(param in body));

  if (missingParams.length > 0) {
    const statusCode = NODE_ENV ? 422 : 400;
    const message =
      NODE_ENV === "development"
        ? `Missing required body parameters: [${missingParams.join(", ")}]`
        : "Missing required body parameters";

    return res.status(statusCode).json({
      status: false,
      error: message,
    });
  }

  next();
};
