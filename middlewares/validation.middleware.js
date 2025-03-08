const { NODE_ENV } = require("../config/env");

exports.validateRequestBody = (requiredBodyParams) => (req, res, next) => {
  const { body, url } = req;

  console.log("[requiredBodyParams]", body);

  // If URL is '/sign-in', make either email or username optional
  if (url === "/sign-in") {
    const missingParams = requiredBodyParams.filter(
      (param) => !(param in body)
    );

    // Check if email or username is missing, if one of them exists, it's valid
    const isEmailOrUsernameMissing = !(body.email || body.username);
    if (isEmailOrUsernameMissing) {
      missingParams.push("email or username");
    }

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
  } else {
    // For other URLs, use the regular validation
    const missingParams = requiredBodyParams.filter(
      (param) => !(param in body)
    );

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
  }

  next();
};
