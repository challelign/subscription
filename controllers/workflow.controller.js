const dayjs = require("dayjs");
const { serve } = require("@upstash/workflow/express");

const Subscription = require("../models/subscription.model");
const { log_error } = require("../utils/logger");
const { sendReminderEmail } = require("../utils/send-email");

const REMINDERS = [7, 5, 2, 1];
exports.sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);
  console.log("[subscription]", subscription);
  if (!subscription || subscription.status !== "active") {
    return;
  }
  const renewalDate = dayjs(subscription.renewalDate);
  /*   console.log("[subscription.renewalDate=>]", subscription.renewalDate);
  console.log("[renewalDate=>]", renewalDate); */

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }
  // const REMINDERS = [7, 5, 2, 1];
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    //   renewal date = 22 feb ,reminder date = 15 feb, 17 , 20 ,21

    //dayjs() gets the current date.
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before `,
        reminderDate
      );
    }

    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription
      );
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label}. Reminder at ${date}.`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} , reminder`);
    // send email , SMS, push notification ...

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};
