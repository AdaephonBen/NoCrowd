const express = require("express");
const verify = require("./auth");
const router = express.Router();
const db = require("./db");
const axios = require("axios");

router.use(async (req, res, next) => {
  const token = req.body.idToken;
  const email = await verify(token);
  req.body.email = email;
  next();
});

// define the home page route
router.post("/items", async (req, res) => {
  const items = await db.getItems(req.body.email);
  res.send(items);
});

router.post("/order", async (req, res) => {
  const order = req.body.order;
  const order_ids = [];
  for (const key in order) {
    order_ids.push(await db.placeOrder(req.body.email, key, order[key]));
  }
  res.send(order_ids);
});

router.post("/status", async (req, res) => {
  const orderids = req.body.orderids;
  console.log("x", orderids);
  const orderstatus = [];
  for (const id of orderids) {
    console.log(id);
    orderstatus.push(await db.getStatus(req.body.email, id));
  }
  console.log(orderstatus);
  let allOrdered = true;
  let totalPrice = 0;
  for (const order of orderstatus) {
    console.log(order.quantity);
    totalPrice += 50 * order.quantity;
    if (order["status"] !== "confirmed") {
      allOrdered = false;
    }
  }
  console.log(totalPrice);
  let rid = "";
  if (allOrdered) {
    body = {
      amount: totalPrice,
      currency: "INR",
    };
    const apiRes = await axios.post(
      "https://api.razorpay.com/v1/orders",
      body,
      {
        auth: {
          username: "rzp_test_Qb1YzJI1e6Wg6n",
          password: "jopiEVTO9h7TekFsE2j2dCAo",
        },
      }
    );
    rid = apiRes.data.id;
    console.log(rid);
  }
  res.send({ orderstatus, rid });
});

router.post("/caterer", async (req, res) => {
  return await db.getOrders();
});

router.post("/confirm", async (req, res) => {
  await db.setOrderConfirmed(req.body.order_id);
});

router.post("/cancel", async (req, res) => {
  await db.setOrderCancelled(req.body.order_id);
});

module.exports = router;
