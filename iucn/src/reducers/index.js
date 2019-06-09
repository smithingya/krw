import { combineReducers } from "redux";

// import reducers here:
import search from "./searchReducer"
import animals from "./retrieveReducer"

export default combineReducers({
  // put imported reducers here:
  search,
  animals,
});
