const { json } = require("body-parser");
const order = require("../model/order");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_ahHdCy6I7ZLyqR",
  key_secret: "JhbXKU4ixLBQYPaFzyfLkKFD",
});

exports.getOrderDetails = (req, res, next) => {
  console.log(req.user.id);
  const amount = 2500;
  razorpay.orders.create({ amount, currency: "INR" }, (err, response) => {
    if (err) {
      console.log(JSON.stringify(err));
    }

    const newOrder = new order({
      orderid: response.id,
      status: "pending",
      userId: req.user.id,
    });
    newOrder
      .save()
      .then(() => {
        res.status(201).json({ response, key_id: razorpay.key_id });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.updateorder = async (req, res, next) => {
  const order_id = req.body.order_id;
  const payment_id = req.body.payment_id;
  let payment = await order.findOne({ where: { orderid: order_id } });
  payment.paymentid = payment_id;
  payment.status = "Complete";
  await payment.save();
};

exports.paymentfailed = async (req, res, next) => {
  const order_id = req.body.order_id;
  const payment_id = req.body.payment_id;
  let payment_fail = await order.findOne({ where: { orderid: order_id } });
  payment_fail.paymentid = payment_id;
  payment_fail.status = "failed";

  await payment_fail.save();
};
