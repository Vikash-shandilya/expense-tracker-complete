const { json } = require("body-parser");
const order = require("../model/order");
const user = require("../model/user");
const Razorpay = require("razorpay");

const environment = "development"; // Change based on your environment
const config = JSON.parse(process.env.CONFIG);

const razorpay = new Razorpay({
  key_id: config[environment].razorpay_key_id,
  key_secret: config[environment].razorpay_key_secret,
});

exports.getOrderDetails = (req, res, next) => {
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
  let useritem = await user.findOne({ where: { id: req.user.id } });
  useritem.ispremium = true;
  await useritem.save();

  res.json({ payment: true });
};

exports.paymentfailed = async (req, res, next) => {
  const order_id = req.body.order_id;
  const payment_id = req.body.payment_id;
  let payment_fail = await order.findOne({ where: { orderid: order_id } });
  payment_fail.paymentid = payment_id;
  payment_fail.status = "failed";

  await payment_fail.save();
};

exports.ifpremium = async (req, res, next) => {
  let result = await user.findOne({ where: { id: req.user.id } });
  res.json(result.ispremium);
};
