require("dotenv").config();

const axios = require("axios");

const paymentId = "pay_TTadpmya0Fl0Df";

async function testRefund() {
  try {
    console.log("Creating PARTIAL Razorpay refund...");
    console.log("Payment ID:", paymentId);
    console.log("Refund amount: ₹100");

    const response = await axios.post(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      {
        amount: 10000
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("========== REFUND SUCCESS ==========");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("====================================");

  } catch (error) {
    console.log("========== REFUND ERROR ==========");

    console.log("HTTP Status:", error.response?.status);

    console.log(
      "Razorpay Response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    console.log("Axios Message:", error.message);

    console.log("=================================");
  }
}

testRefund();