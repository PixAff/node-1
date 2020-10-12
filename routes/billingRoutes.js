const Stripe = require("stripe");
const mongoose = require("mongoose");
const axios = require("axios");
const bodyParser = require("body-parser");

const keys = require("../config/keys");
const userModel = require("../models/User");
const requireLogin = require("../middlewares/requireLogin");
const stripe = new Stripe(keys.stripeSecretKey);
const endpointSecret = keys.stripeWebhook;

const fulfillOrder = async (session) => {
  try {
    const actualUser = await userModel.findById(session.client_reference_id);
    actualUser.credits += 5;
    const user = await actualUser.save();
    console.log("User", user);
  } catch (error) {
    console.log(error);
  }
  // console.log("Fulfilling order", session);
  // res.send(user);
};

module.exports = (app) => {
  app.post(
    "/api/create-session",
    requireLogin,
    bodyParser.json(),
    async (req, res) => {
      // console.log(req.body);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Stefans Credits",
                description: "payed for Stefans Credits",
                images: ["https://i.imgur.com/EHyR2nP.png"],
              },
              unit_amount: 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/surveys?success=true",
        cancel_url: "http://localhost:3000/surveys?canceled=true",
        customer_email: "customer@example.com",
        client_reference_id: req.body.user_id,
      });
      res.json({ id: session.id });
    }
  );

  app.post(
    "/api/stripe/webhook",
    bodyParser.raw({ type: "application/json" }),
    (req, res) => {
      const payload = req.body;
      // console.log(payload.toString());
      const sig = req.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      } catch (err) {
        console.log("ERROR: " + err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the checkout.session.completed event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Fulfill the purchase...
        fulfillOrder(session);
      }

      res.status(200).send("done");
    }
  );
};
