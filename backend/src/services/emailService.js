const transporter = require("../config/mail");

const sendPaymentReceipt = async (
  email,
  customerName,
  payment,
  pdfBuffer
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Amara Lands - Payment Receipt",

      html: `
        <h2>Payment Successful</h2>

        <p>Dear <b>${customerName}</b>,</p>

        <p>Your payment has been received successfully.</p>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr>
            <td><b>Property</b></td>
            <td>${payment.property_name}</td>
          </tr>

          <tr>
            <td><b>Amount</b></td>
            <td>₹${payment.amount}</td>
          </tr>

          <tr>
            <td><b>Payment For</b></td>
            <td>${payment.payment_for}</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td>${payment.payment_status}</td>
          </tr>
        </table>

        <br>

        <p>Please find your payment receipt attached.</p>

        <br>

        <p>Thank you for choosing <b>Amara Lands</b>.</p>
      `,

      attachments: [
        {
          filename: `Receipt-${payment.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log("✅ Payment receipt email sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendPaymentReceipt,
};