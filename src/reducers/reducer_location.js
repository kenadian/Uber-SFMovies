import {
  LOC_DATA_REQ_MANAGER,
  LOC_UPDATE_PROGRESS,
  LOC_ZERO_COUNTERS
} from "../actions/location_actions";
import { FETCH_MOVIE_BY_TITLE } from "../actions/movie_actions";
let initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case LOC_ZERO_COUNTERS:
      return { ...state, locationCount: null, progressCounter: 0 };
    case FETCH_MOVIE_BY_TITLE:
      return { ...state, locationCount: action.payload.data.length };
    case LOC_UPDATE_PROGRESS:
      return { ...state, progressCounter: action.payload };
    case LOC_DATA_REQ_MANAGER:
      return { ...state };
    default:
      return { ...state };
  }
}
