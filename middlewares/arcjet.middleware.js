const { log_error } = require("../utils/logger");

exports.arcjetMiddleware = async (req, res, next) => {
  try {
    // Dynamically import the arcjet package
    const arcjet = await import("@arcjet/node");
    const { shield, detectBot, tokenBucket } = arcjet;

    // Dynamically import the arcjet configuration (ESM)
    const aj = await import("../config/arcjet.js"); // Use dynamic import for ESM file

    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({ error: "Rate limit exceeded" });
      if (decision.reason.isBot())
        return res.status(403).json({ error: "Bot detected" });

      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    log_error("[ARCJET_ERROR] " + error.stack.split("\n").join("\n\t"));
    next(error);
  }
};

// module.exports = arcjetMiddleware;
