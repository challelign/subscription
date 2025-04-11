const { initializeAj } = require("../config/arcjet.js");

const arcjetMiddleware = async (req, res, next) => {
  try {
    // Initialize `aj` using the async function
    const aj = await initializeAj();

    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({ error: "Rate limit exceeded" });
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot detected" });
      }
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    log_error(
      "[ARCJET_MIDDLEWARE_ERROR] " + error.stack.split("\n").join("\n\t") 
    );

    next(error);
  }
}; 

module.exports = arcjetMiddleware;
