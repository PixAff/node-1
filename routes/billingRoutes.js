const Stripe = require("stripe");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const stripe = new Stripe(keys.stripeSecretKey);

module.exports = (app) => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    const { id, amount } = req.body;
    const payment = await stripe.checkout.sessions.create({
      amount,
      currency: "EUR",
      description: "Alcohol",
      payment_method: id,
      confirm: true,
    });
    req.user.credits += 5;
    const user = await req.user.save();

    res.send(user);
  });

  app.post("/api/create-session", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Stubborn Attachments",
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
    });
    res.json({ id: session.id });
    // res.send(user);
    // req.user.credits += 5;
    // const user = await req.user.save();
  });
};

// export default async (req, res) => {
//   const { id, amount } = req.body;

//   try {
//     const payment = await stripe.paymentIntents.create({
//       amount,
//       currency: 'EUR',
//       description: "Alcohol",
//       payment_method: id
//       confirm: true
//     })
//     console.log(payment)

//     return res.status(200).json({
//       confirm: "abc123"
//     })
//   } catch (error) {}
// };
