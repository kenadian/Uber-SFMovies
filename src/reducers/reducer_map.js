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
  MAP_SET_ONBOARD_COOKIE,
  MAP_PLACES,
  MAP_GET_LOC_DATA_FROM_IDB,
  MAP_CLOSE_ALL_INFO_WINDOWS,
  MAP_CLOSE_INFO_WINDOW,
  MAP_SET_MAP_ON_ONE,
  MAP_GET_MARKER,
  MAP_HAS_WINDOW,
  MAP_ZOOM_TO_SF
} from "../actions/map_actions";

let initialState = {
  // locations: [],
  googlePlaceResults: [],
  googlePlaceResults1: [],
  isGettingGooglePlaceResults: false,
  googlePlaceZeroResults: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MAP_ZOOM_TO_SF:
      return { ...state };
    case MAP_HAS_WINDOW:
      return { ...state };
    case MAP_GET_MARKER:
      return { ...state };
    case MAP_CLOSE_INFO_WINDOW:
      return { ...state };
    case MAP_CLOSE_ALL_INFO_WINDOWS:
      return { ...state };
    case MAP_SET_ONBOARD_COOKIE:
      return { ...state };
    case MAP_INIT:
      return { ...state };
    case MAP_CREATE_MARKER:
      return { ...state };
    case MAP_GET_LOCATION_DATA:
      return { ...state };
    case MAP_SET_MAP_ON_ONE:
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
      return { ...state, googlePlaceResults: [], googlePlaceResults1: [] };
    case MAP_GET_LOC_DATA_FROM_IDB:
      return { ...state };
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
              //NOTE to get all the photos map through action.payload.places[0].photos and getUrl()

              value.places.photos[0].Url = action.payload.places[0].photos[0].getUrl();
            }
            store.put(value);
          }
        });
      }
      let googlePlaceResults1 =
        state.googlePlaceResults1.length > 0
          ? state.googlePlaceResults1.slice(0)
          : [];

      if (
        action.payload.status !== "undefined" &&
        action.payload.status === "OK"
      ) {
        // Google gave us something good.
        googlePlaceResults1.push(action.payload);

        return {
          ...state,
          googlePlaceResults1
        };
      }

      if (
        action.payload.status !== "undefined" &&
        action.payload.status === "ZERO_RESULTS"
      ) {
        // Google gave us something. Useful to indicate no result but still a location.
        googlePlaceResults1.places = null;
        googlePlaceResults1.push(action.payload);
        return {
          ...state,
          googlePlaceResults1
        };
      }
      return {
        ...state
      };
    case MAP_PLACES:
      return { ...state, googlePlaceResults: state.googlePlaceResults1 };
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
