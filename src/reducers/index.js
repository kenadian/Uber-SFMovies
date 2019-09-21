import { combineReducers } from "redux";
import MovieReducer from "./reducer_movie";
import MapReducer from "./reducer_map";
import LocationReducer from "./reducer_location";

const rootReducer = combineReducers({
  movies: MovieReducer,
  maps: MapReducer,
  location: LocationReducer
});

export default rootReducer;
