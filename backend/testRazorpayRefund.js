require("dotenv").config();

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function test() {
  try {
    const paymentId = "pay_TTadpmya0Fl0Df";

    const payment = await razorpay.payments.fetch(paymentId);

    console.log("========== PAYMENT ==========");
    console.log(JSON.stringify(payment, null, 2));
    console.log("=============================");

    console.log("========== ORDER ==========");

    const order = await razorpay.orders.fetch(payment.order_id);

    console.log(JSON.stringify(order, null, 2));

    console.log("===========================");

  } catch (error) {
    console.log("========== ERROR ==========");
    console.log("Status:", error.statusCode);
    console.log("Error:", error.error);
    console.log("Message:", error.message);
    console.log("===========================");
  }
}

test();