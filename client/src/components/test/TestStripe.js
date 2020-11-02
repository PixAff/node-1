import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import * as actions from "../actions";
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";

class CheckoutForm extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();
    const { stripe, elements } = this.props;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);

    if (!error) {
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post("/api/stripe", { id, amount: 399 });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    const { stripe } = this.props;
    return (
      <form
        style={{ maxWidth: "400px", margin: "0 auto" }}
        onSubmit={this.handleSubmit}
        token={this.props.handleToken}
      >
        <h5>Price: € 3,99</h5>
        <img
          style={{ width: "100px" }}
          src="https://images.unsplash.com/photo-1594816781886-a4a3a10f0d37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80"
          alt="alcohol"
        />
        <CardElement />
        <button className="btn" type="submit" disabled={!stripe}>
          Add Credits
        </button>
      </form>
    );
  }
}

const InjectedCheckoutForm = () => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <CheckoutForm
        // token={this.props.handleToken(id)}
        stripe={stripe}
        elements={elements}
      />
    )}
  </ElementsConsumer>
);

export default connect(null, actions)(InjectedCheckoutForm);
