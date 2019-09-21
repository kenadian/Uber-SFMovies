import { combineReducers } from "redux";
import MovieReducer from "./reducer_movie";
import MapReducer from "./reducer_map";
import LocationReducer from "./reducer_location";
import IDBReducer from "./reducer_idb";

const rootReducer = combineReducers({
  movies: MovieReducer,
  maps: MapReducer,
  location: LocationReducer,
  idb: IDBReducer
});

export default rootReducer;
