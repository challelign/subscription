const { Client: WorkflowClient } = require("@upstash/workflow");

const { QSTASH_TOKEN, QSTASH_URL } = require("./env.js");

const workflowClient = new WorkflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});

module.exports = { workflowClient };
