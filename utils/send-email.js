const dayjs = require("dayjs");
const { transporter, accountEmail } = require("../config/nodemailer.js");

const { emailTemplates } = require("./email-template.js");

const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type || !subscription) {
    console.log(to, type, subscription);
    throw new Error("Missing required parameters");
  }

  const template = emailTemplates.find((t) => t.label === type);
  console.log("Email templete", template);
  if (!template) {
    throw new Error(`Invalid email type: ${type}`);
  }

  const {
    user = {},
    name: subscriptionName = "",
    renewalDate,
    currency = "",
    price = "",
    frequency = "",
    paymentMethod = "",
  } = subscription;

  const { name: userName = "" } = user;

  if (type === "thank_you") {
    console.log("I am here");
  }

  if (
    !userName ||
    !subscriptionName ||
    (!renewalDate && type !== "thank_you")
  ) {
    console.log(
      "[userName subscriptionName renewalDate]",
      userName,
      subscriptionName,
      renewalDate
    );

    throw new Error("Incomplete subscription information");
  }

  const mailInfo = {
    userName,
    subscriptionName,
    // renewalDate: dayjs(renewalDate).format("MMM D, YYYY"),
    renewalDate: renewalDate ? dayjs(renewalDate).format("MMM D, YYYY") : "",

    planName: subscriptionName,
    price: `${currency} ${price} (${frequency})`,
    paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to,
    subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Sending email failed ❌:", error);
    } else {
      console.log("You have sent an Email successfully✅:", info.response);
    }
  });
};

module.exports = { sendReminderEmail };
