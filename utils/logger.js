const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const timestamp = () => dayjs().format("dddd, MMMM DD, YYYY h:mm:ss A");
const today = () => dayjs().format("DD-MM-YYYY");

const logToFile = (fileName, content) => {
  const logPath = path.join(__dirname, "../logs");
  const logFile = path.join(logPath, fileName);

  // Create the logs directory if it doesn't exist
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }

  fs.appendFile(logFile, content, (err) => {
    if (err) {
      console.log(err);
      return 0;
    }
  });
};

exports.log_error = (content) => {
  const logFileName = `error_log_${today()}.log`;
  const message = `\n${timestamp()} -----> ${content}\n`;
  logToFile(logFileName, message);
};
