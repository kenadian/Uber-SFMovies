import { LOC_DATA_REQ_MANAGER } from "../actions/location_actions";
let initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case LOC_DATA_REQ_MANAGER:
      return { ...state };
    default:
      return { ...state };
  }
}
