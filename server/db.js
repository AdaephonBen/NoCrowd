const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "nocrowd",
  password: "p123",
  port: 5432,
});

const getItems = async (email) => {
  const res3 = await pool.query('SELECT * from public."User" where email=$1', [
    email,
  ]);
  if (res3.rows.length == 0) {
    const res1 = await pool.query(
      `INSERT INTO public."User" (email) VALUES ($1)`,
      [email]
    );
  }
  const res = await pool.query(
    'SELECT a.id, a.name, a.rating, a.price, b.name as caterer_name from public."Item" AS a, public."Caterer" AS b WHERE a.caterer_id = b.id'
  );
  return res.rows;
};

const placeOrder = async (email, item_id, quantity) => {
  const res = await pool.query('SELECT id from public."User" where email=$1', [
    email,
  ]);
  const res2 = await pool.query(
    'SELECT caterer_id from public."Item" WHERE id=$1',
    [item_id]
  );
  const res1 = await pool.query(
    'INSERT INTO public."Order" (user_id, item_id, caterer_id, quantity) VALUES ($1, $2, $3, $4) RETURNING id',
    [res.rows[0].id, item_id, res2.rows[0].caterer_id, quantity]
  );
  return res1.rows[0].id;
};

const getStatus = async (email, orderid) => {
  const res = await pool.query('SELECT id from public."User" where email=$1', [
    email,
  ]);
  const userid = res.rows[0].id;
  console.log(userid);
  console.log(orderid);
  const res1 = await pool.query(
    `SELECT b.id as orderid, a.name AS Item, b.quantity as quantity, b.status as status FROM public."Item" as a, public."Order" AS b WHERE b.user_id=$1 and (b.status='ordered' or b.status='confirmed' or b.status='payment received') and a.id=b.item_id and b.id=$2`,
    [userid, orderid]
  );
  return res1.rows[0];
};

const getOrders = async () => {
  const res1 = await pool.query(
    'SELECT b.id AS id, a.name AS name, b.quantity AS quantity, b.status AS status FROM public."Item" AS a, public."Order" AS b WHERE a.id=b.item_id and b.caterer_id=1'
  );
  console.log(res1.rows);
  return res1.rows;
};

const setOrderConfirmed = async (order_id) => {
  const res = await pool.query(
    `UPDATE public."Order" SET status='confirmed' WHERE id=$1`,
    [order_id]
  );
};

const setOrderCancelled = async (order_id) => {
  const res = await pool.query(
    `UPDATE public."Order" SET status='cancelled' WHERE id=$1`,
    [order_id]
  );
};

const setStatus = async (order_id) => {
  const res = await pool.query(
    `UPDATE public."Order" SET status='payment received' WHERE id=$1`,
    [order_id]
  );
};

module.exports = {
  getItems,
  placeOrder,
  getStatus,
  getOrders,
  setOrderCancelled,
  setOrderConfirmed,
  setStatus,
};
