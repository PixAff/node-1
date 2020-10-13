import React, { useState, useEffect } from "react";
import axios from "axios";

import { loadStripe } from "@stripe/stripe-js";

// update
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutBtn = ({ handleClick }) => (
  <section>
    <button
      className="btn"
      id="checkout-button"
      role="link"
      onClick={handleClick}
    >
      Checkout
    </button>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Stripe(props) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // console.log(props);
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  const handleClick = async (event) => {
    const stripe = await stripePromise;

    const response = await axios.post("api/create-session", {
      user_id: props.user._id,
    });
    // const response = await fetch("api/create-session", {
    //   method: "POST",
    // });

    const session = await response.data;
    // const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  // return message ? (
  //   <Message message={message} />
  // ) : (
  //   <CheckoutBtn handleClick={handleClick} />
  // );
  return <CheckoutBtn handleClick={handleClick} />;
}
