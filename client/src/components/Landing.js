import React from "react";

import PayPalBtn from "./Paypal";

class Landing extends React.Component {
  paymentHandler = (details, data) => {
    /** Here you can call your backend API
        endpoint and update the database */
    console.log(details, data);
  };
  render() {
    return (
      <div style={{ width: "160px" }}>
        <div>Online Payment Demo</div>
        <PayPalBtn
          amount={0.1}
          currency={"EUR"}
          onSuccess={this.paymentHandler}
        />
      </div>
    );
  }
}

export default Landing;
