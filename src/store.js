import { createStore, applyMiddleware, compose } from "redux";
import ReduxPromise from "redux-promise"; //handles promises
import rootReducers from "./reducers";

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
      latency: 0
    })) ||
  compose;
const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(ReduxPromise))
);
export default store;
