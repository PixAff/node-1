import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import formFields from "./formFields";
import * as actions from "../../actions";

const SurveyReview = ({ onCancel, formValues, submitSurvey, history }) => {
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
        className="yellow darken-3 btn-flat white-text"
        type="submit"
      >
        back
      </button>
      <button
        onClick={() => submitSurvey(formValues, history)}
        className="green btn-flat right white-text"
      >
        Send Survey<i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStatetoProps(state) {
  return { formValues: state.form.surveyForm.values };
}

export default connect(mapStatetoProps, actions)(withRouter(SurveyReview));
