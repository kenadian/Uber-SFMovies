import {
  getLocationDataInBackground,
  toggleIsGettingGooglePlaceResults,
  mapPlaces
} from "./map_actions";
import store from "../store";

export const LOC_DATA_REQ_MANAGER = "LOC_DATA_REQ_MANAGER";
export const LOC_UPDATE_PROGRESS = "LOC_UPDATE_PROGRESS";
export const LOC_ZERO_COUNTERS = "LOC_ZERO_COUNTERS";

export function zeroCounters() {
  return { type: LOC_ZERO_COUNTERS };
}

export function updateProgress(counter) {
  return { type: LOC_UPDATE_PROGRESS, payload: counter };
}
/**
 *
 *
 * @export
 * @param requestObject = {} {locationDetails:{n [n fields:'string']},request:{fields:array,query:string}}
 * @returns Promise from
 */
export function getLocDataReqManager(requestObject = null) {
  let defaultTimeout = 350;
  let overLimitTimeout = defaultTimeout * 4;
  let tempCounter = 0;
  const getPlaceRecursive = (value, index, timeout, requestObjectLength) => {
    setTimeout(() => {
      store.dispatch(getLocationDataInBackground(value)).then(response => {
        tempCounter++;
        store.dispatch(updateProgress(tempCounter));

        if (
          response.payload.status &&
          response.payload.status === "OVER_QUERY_LIMIT"
        ) {
          getPlaceRecursive(
            value,
            index,
            overLimitTimeout,
            requestObjectLength
          );
        }
        if (
          response.payload.status &&
          response.payload.status === "OK" &&
          index === requestObjectLength - 1
        ) {
          store.dispatch(toggleIsGettingGooglePlaceResults(false));
        }
        if (
          response.payload.status &&
          response.payload.status === "ZERO_RESULTS" &&
          index === requestObjectLength - 1
        ) {
          store.dispatch(toggleIsGettingGooglePlaceResults(false));
        }
        if (
          response.payload.status &&
          response.payload.status === "UNKNOWN_ERROR" &&
          index === requestObjectLength - 1
        ) {
          store.dispatch(toggleIsGettingGooglePlaceResults(false));
          console.error(
            `Google responded with an "${response.payload.status}" message. Try again.`
          );
        }
        // copy googlePlaceResults1 holding state to googlePlaceResults rendering state
        // limits the number of renders from always changing the state
        // done when all locations have been sent and data has been received
        if (index === requestObjectLength - 1) {
          store.dispatch(mapPlaces());
        }
      });
    }, timeout);
  };
  requestObject.forEach((value, index, inputArray) => {
    getPlaceRecursive(
      value,
      index,
      defaultTimeout * index,
      requestObject.length
    );
  });

  return {
    type: LOC_DATA_REQ_MANAGER
  };
}
