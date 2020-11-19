import { combineReducers } from "redux";
import { reducer as ReduxForm } from "redux-form";

import authReducer from "./authReducer";
import surveysReducer from "./surveysReducer";

export default combineReducers({
  auth: authReducer,
  form: ReduxForm,
  surveys: surveysReducer,
});
