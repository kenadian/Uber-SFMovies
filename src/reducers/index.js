import { combineReducers } from "redux";
import MovieReducer from "./reducer_movie";
import MapReducer from "./reducer_map";
const rootReducer = combineReducers({
  movies: MovieReducer,
  maps: MapReducer
});

export default rootReducer;
