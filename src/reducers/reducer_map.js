import { openMoviesIDB } from "../functions/idb";
import {
  MAP_INIT,
  MAP_CREATE_MARKER,
  MAP_GET_LOCATION_DATA,
  MAP_SET_MAP_ON_ALL,
  MAP_CLEAR_MARKERS,
  MAP_SHOW_MARKERS,
  MAP_DELETE_MARKERS,
  MAP_GET_LOC_DATA_IN_BG,
  MAP_CLEAR_GOOGLE_PLACE_RESULTS,
  IS_GETTING_GOOGLE_PLACE_RESULTS,
  MAP_SAVE_PLACES_LOCALSTORAGE,
  MAP_SHOW_ALL_LOCATIONS,
  MAP_SET_ONBOARD_COOKIE
} from "../actions/map_actions";

let initialState = {
  locations: [],
  googlePlaceResults: [],
  isGettingGooglePlaceResults: false,
  processingLocations: false,
  googlePlaceZeroResults: [],
  zeroResults: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MAP_SET_ONBOARD_COOKIE:
      return { ...state };
    case MAP_INIT:
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

    case IS_GETTING_GOOGLE_PLACE_RESULTS:
      return { ...state, isGettingGooglePlaceResults: action.payload };
    case MAP_CLEAR_GOOGLE_PLACE_RESULTS:
      return { ...state, googlePlaceResults: [] };
    case MAP_GET_LOC_DATA_IN_BG:
      if (action.payload.dataSource === "server") {
        // add places data to the location data already in indexeddb store
        // only if the data comes from the server
        openMoviesIDB().then(async db => {
          const store = db
            .transaction("locations", "readwrite")
            .objectStore("locations");
          let value = await store.get(action.payload.id).then(result => result);

          if (action.payload.status === "OK") {
            // need to strigify to get rid of functions so we can store in indexeddb
            value.places = JSON.parse(JSON.stringify(action.payload.places[0]));
            // check if there is a photo and store the Url
            if (action.payload.places[0].hasOwnProperty("photos")) {
              //TODO to get all the photos map through action.payload.places[0].photos
              // and getUrl()

              value.places.photos[0].Url = action.payload.places[0].photos[0].getUrl();
            }
            store.put(value);
          }
        });
      }
      let googlePlaceResults =
        state.googlePlaceResults.length > 0
          ? state.googlePlaceResults.slice(0)
          : [];

      if (
        action.payload.status !== "undefined" &&
        action.payload.status === "OK"
      ) {
        // googlePlaceResults[action.payload.id] = [];
        // googlePlaceResults[action.payload.id].push(action.payload);

        googlePlaceResults.push(action.payload);

        return {
          ...state,
          googlePlaceResults
        };
      }

      return {
        ...state
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
