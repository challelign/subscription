const { ARCJET_KEY } = require("./env.js"); // Local module import with `require()`

const initializeAj = async () => {
  try {
    // Dynamically import the ES module `@arcjet/node`
    const arcjetModule = await import("@arcjet/node"); // Dynamically import the ES module

    // Destructure the module
    const { shield, detectBot, tokenBucket } = arcjetModule;

    // Initialize aj with the imported functions
    const aj = arcjetModule.default({
      key: ARCJET_KEY,
      characteristics: ["ip.src"],
      rules: [
        shield({ mode: "LIVE" }),
        detectBot({
          mode: "LIVE",
          allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
        tokenBucket({
          mode: "LIVE",
          refillRate: 5, // Refill 5 tokens per interval
          interval: 10, // Refill every 10 seconds
          capacity: 10, // Bucket capacity of 10 tokens
        }),
      ],
    });

    return aj;
  } catch (error) {
    console.error("Error initializing Arcjet:", error);
    log_error("[ARCJET_ERROR] " + error.stack.split("\n").join("\n\t"));

    throw error;
  }
};

// Export the initialization function
module.exports = { initializeAj };
