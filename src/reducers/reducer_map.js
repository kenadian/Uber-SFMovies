import {
  MAP_INIT,
  MAP_LOCATIONS,
  MAP_CREATE_MARKER,
  MAP_GET_LOCATION_DATA,
  MAP_SET_MAP_ON_ALL,
  MAP_CLEAR_MARKERS,
  MAP_SHOW_MARKERS,
  MAP_DELETE_MARKERS,
  MAP_GET_LOC_DATA_IN_BG,
  MAP_FIND_PLACE_RESULTS,
  MAP_FIND_PLACE_RESULTS_OVERLIMIT,
  MAP_RESET_PLACE_RESULTS_OVERLIMIT,
  MAP_FIND_PLACE_ZERO_RESULTS,
  MAP_SAVE_PLACES_LOCALSTORAGE,
  MAP_SHOW_ALL_LOCATIONS
} from "../actions/map_actions";

let initialState = {
  locations: [],
  googlePlaceResults: [],
  googlePlaceResultsOverLimit: [],
  overLimit: false,
  processingLocations: false,
  googlePlaceZeroResults: [],
  zeroResults: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MAP_INIT:
      return { ...state };
    case MAP_LOCATIONS:
      return { ...state };
    case MAP_CREATE_MARKER:
      return { ...state };
    case MAP_GET_LOCATION_DATA:
      return { ...state };
    case MAP_SET_MAP_ON_ALL:
      return { ...state };
    case MAP_CLEAR_MARKERS:
      return { ...state };
    case MAP_SHOW_MARKERS:
      return { ...state };
    case MAP_DELETE_MARKERS:
      return { ...state };
    case MAP_GET_LOC_DATA_IN_BG:
      console.log(action.payload);
      return { ...state, processingLocations: action.payload };
    case MAP_FIND_PLACE_RESULTS:
      let newState = state.googlePlaceResults.slice(0);
      newState.push(action.payload);

      return {
        ...state,
        googlePlaceResults: newState
      };
    case MAP_FIND_PLACE_RESULTS_OVERLIMIT:
      let newState2 = state.googlePlaceResultsOverLimit.slice(0);
      newState2.push(action.payload);

      return {
        ...state,
        googlePlaceResultsOverLimit: newState2,
        overLimit: true
      };
    case MAP_RESET_PLACE_RESULTS_OVERLIMIT:
      return { ...state, googlePlaceResultsOverLimit: [] };
    case MAP_FIND_PLACE_ZERO_RESULTS:
      let newState3 = state.googlePlaceZeroResults.slice(0);
      newState3.push(action.payload);
      return {
        ...state,
        googlePlaceZeroResults: newState3,
        zeroResults: true
      };
    case MAP_SAVE_PLACES_LOCALSTORAGE:
      localStorage.setItem("places", JSON.stringify(state.googlePlaceResults));
      return {
        ...state
      };
    case MAP_SHOW_ALL_LOCATIONS:
      return {
        ...state
      };
    default:
      return state;
  }
}
