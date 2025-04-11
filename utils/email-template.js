const generateEmailTemplate = ({
  userName,
  subscriptionName,
  renewalDate,
  planName,
  price,
  paymentMethod,
  accountSettingsLink,
  supportLink,
  daysLeft,
}) =>
  `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);">
    <tr>
      <td style="background: linear-gradient(90deg, #4a90e2, #357ABD); text-align: center; padding: 30px;">
        <p style="font-size: 48px; line-height: 1.2; font-weight: 800; color: #ffffff; margin: 0;">CodeRookie</p>
        <p style="font-size: 16px; color: #e6f0fa; margin-top: 8px;">Subscription Notification</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="font-size: 17px; margin-bottom: 24px;">Hi <strong style="color: #4a90e2;">${userName}</strong>,</p>

        <p style="font-size: 16px; margin-bottom: 24px;">
         ${
           typeof daysLeft === "number"
             ? `Your <strong>${subscriptionName}</strong> subscription will renew on <strong style="color: #4a90e2;">${renewalDate}</strong>
         <span style="color: #888;">(${daysLeft} days left)</span>.`
             : `Thanks for joining <strong>${subscriptionName}</strong>!`
         }
        </p>
        <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f6faff; border-radius: 10px; margin-bottom: 30px;">
          <tr>
            <td style="font-size: 15px; border-bottom: 1px solid #d8eaff;">
              <strong>Plan:</strong> ${planName}
            </td>
          </tr>
          <tr>
            <td style="font-size: 15px; border-bottom: 1px solid #d8eaff;">
              <strong>Price:</strong> ${price}
            </td>
          </tr>
          <tr>
            <td style="font-size: 15px;">
              <strong>Payment Method:</strong> ${paymentMethod}
            </td>
          </tr>
        </table>

        <p style="font-size: 16px; margin-bottom: 24px;">
          You can update or cancel your subscription from your
          <a href="${accountSettingsLink}" style="color: #4a90e2; text-decoration: underline;">account settings</a>
          before the renewal date.
        </p>

        <p style="font-size: 16px; margin-top: 32px;">
          Need help? <a href="${supportLink}" style="color: #4a90e2; text-decoration: underline;">Contact Support</a>
        </p>

        <p style="font-size: 16px; margin-top: 40px;">
          Best regards,<br>
          <strong>The CodeRookie Team</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #eef5fc; padding: 24px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 0 0 10px;">
          CodeRookie Inc. | 123 Minilike Sq, Addis Ababa, Ethiopia
        </p>
        <p style="margin: 0;">
          <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 8px;">Unsubscribe</a> |
          <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 8px;">Privacy Policy</a> |
          <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 8px;">Terms</a>
        </p>
      </td>
    </tr>
  </table>
</div>

`;

const emailTemplates = [
  {
    label: "thank_you",
    generateSubject: (data) =>
      `🙏 Thank you for subscribing  ${data.subscriptionName}!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 300 }), // Arbitrary large daysLeft just for formatting
  },
  {
    label: "7 days before reminder",
    generateSubject: (data) =>
      `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
  },
  {
    label: "5 days before reminder",
    generateSubject: (data) =>
      `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
  },
  {
    label: "2 days before reminder",
    generateSubject: (data) =>
      `🚀 2 Days Left!  ${data.subscriptionName} Subscription Renewal`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
  },
  {
    label: "1 days before reminder",
    generateSubject: (data) =>
      `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
  },
];

module.exports = {
  emailTemplates,
};
