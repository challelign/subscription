const mongoose = require("mongoose");
const { DB_URI, NODE_ENV, PORT } = require("../config/env");
const { log_error } = require("../utils/logger");

if (!DB_URI) {
  log_error(
    "Please define the MONGODB_URI environment variable inside" +
      "\n\t" +
      new Error().stack.split("\n").join("\n\t") // Assuming you want the current error stack
  );
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.<development/production>.local"
  );
}

const connectToDatabase = async () => {
  try {
    const dbLogs = await mongoose.connect(DB_URI);
    // console.log("[dbLogs]", dbLogs.Connection);
    // log_error(
    //   `Connected to database in
    //     ${NODE_ENV} mode on port =>${PORT}`
    // );
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to database: ", error);
    log_error(
      "Failed to get database connection" +
        "\n\t" +
        error.stack.split("\n").join("\n\t")
    );
    throw error;
    process.exit(1);
  }
};

module.exports = connectToDatabase;
