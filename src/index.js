import React from "react";
import ReactDOM from "react-dom";
import { deleteDB, wrap, unwrap } from "idb";
import { openDB } from "idb/with-async-ittr.js";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

import ReduxPromise from "redux-promise"; //handles promises
import rootReducers from "./reducers";
// import logger from "redux-logger";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
      latency: 0
    })) ||
  compose;
export const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(ReduxPromise))
);

localStorage.removeItem("savedSearch");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
