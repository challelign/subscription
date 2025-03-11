const { Router } = require("express");
const { sendReminders } = require("../controllers/workflow.controller");

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

module.exports = workflowRouter;
