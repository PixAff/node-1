import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import formFields from "./formFields";

const SurveyReview = ({ onCancel, formValues }) => {
  const reviewField = _.map(formFields, (field) => {
    return (
      <div key={field.name}>
        <label>{field.label}</label>
        <div>{formValues[field.name]}</div>
      </div>
    );
  });
  return (
    <div className="container">
      <h5>Please review your Survey!</h5>
      {reviewField}
      <button
        onClick={onCancel}
        className="yellow btn-flat black-text"
        type="submit"
      >
        back
      </button>
    </div>
  );
};

function mapStatetoProps(state) {
  return { formValues: state.form.surveyForm.values };
}

export default connect(mapStatetoProps)(SurveyReview);
