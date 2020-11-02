import React from "react";
import { reduxForm } from "redux-form";
import SurveyForm from "./SurveyForm";
import SurveyReview from "./SurveyFormReview";

class SurveyNew extends React.Component {
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }
    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: "surveyForm", // wiring up redux form here dumps the form from the new form component
})(SurveyNew);
