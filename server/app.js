require("dotenv").config();
const express = require("express");
const app = express();

const stripe = require("stripe")("sk_test_51LkrgoSFgx4gzLZV3uJxt0LMfzCzhzJYufdsLBAbUliFbRdU76DhFfsxbY4idTz1Hqhg4U3cv4bNWux2oQTpgulG00zKMatJhE");

app.use(express.json());

const corsOptions = {
  origin: ["https://nike-store-mern.vercel.app", "http://localhost:5173"],
};
const cors = require("cors");
app.use(cors(corsOptions));

// checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.title,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.cartQuantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `https://nike-store-mern.vercel.app/sucess`,
    cancel_url: `https://nike-store-mern.vercel.app/cancel`,
  });

  res.json({ id: session.id });
});

app.listen(8000, () => {
  console.log("server start");
});
