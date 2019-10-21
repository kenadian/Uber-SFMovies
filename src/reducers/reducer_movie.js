import {
  FETCH_MOVIE_AC,
  FETCH_MOVIE_BY_ROW,
  FETCH_MOVIE_ALL,
  CLEAR_MOVIE_HISTORY,
  FETCH_MOVIE_BY_TITLE,
  CLEAR_MOVIE_AC,
  MOVIE_GET_VIEWED_TITLES,
  MOVIE_DELETE_VIEWED_TITLES
} from "../actions/movie_actions";
import {
  MAP_CREATE_MARKER,
  MAP_CLEAR_MARKERS,
  MAP_CLOSE_INFO_WINDOW,
  MAP_OPEN_INFO_WINDOW,
  MAP_SET_MAP_ON_ONE,
  MAP_SHOW_ALL_LOCATIONS,
  MAP_CLOSE_ALL_INFO_WINDOWS
} from "../actions/map_actions";

let initialState = {
  searchResults: [],
  viewedTitles: [],
  locations: [],
  markers: [],
  markerWindows: [],
  movieDetails: {}
};

export default function(state = initialState, action) {
  //TODO move the markers to maps unless that doesn't work
  switch (action.type) {
    case MAP_CLOSE_ALL_INFO_WINDOWS:
      return {
        ...state,
        markerWindows: []
      };

    case MAP_SHOW_ALL_LOCATIONS:
      return {
        ...state,
        markerWindows: []
      };
    case MAP_SET_MAP_ON_ONE:
      const markers = state.markers.filter(value => value !== action.payload);

      const newMarkerWindow = state.markerWindows.filter(
        value => value !== action.payload
      );

      return { ...state, markers, markerWindows: newMarkerWindow };

    case MAP_OPEN_INFO_WINDOW:
      const tempMarkerWindows = state.markerWindows.slice();
      tempMarkerWindows.push(action.payload[0]);

      return { ...state, markerWindows: tempMarkerWindows };
    case MAP_CLOSE_INFO_WINDOW:
      const markerWindows = state.markerWindows.filter(
        markerWindow => markerWindow !== action.payload[0]
      );
      return {
        ...state,
        markerWindows: markerWindows
      };
    case MAP_CLEAR_MARKERS:
      return { ...state, markers: [], markerWindows: [] };
    case MAP_CREATE_MARKER:
      const markedLocations = state.locations.filter(loc => {
        return (
          action.payload.filter(id => {
            return loc.id === id;
          }).length === 1
        );
      });

      return {
        ...state,
        markers: markedLocations.map(loc => loc.id),
        markerWindows: [...state.markerWindows, action.locId]
      };
    case MOVIE_DELETE_VIEWED_TITLES:
      return { ...state, viewedTitles: action.payload };
    case MOVIE_GET_VIEWED_TITLES:
      return { ...state, viewedTitles: action.payload };
    case FETCH_MOVIE_AC:
      return { ...state, searchResults: action.payload.data };
    case FETCH_MOVIE_BY_TITLE:
      localStorage.setItem("movieTitle", JSON.stringify(action.payload.data));
      const {
        title,
        release_year,
        locations,
        fun_facts,
        production_company,
        distributor,
        director,
        writer,
        actor_1,
        actor_2,
        actor_3
      } = action.payload.data[0];

      let payloadLocation;

      if (action.payload.hasOwnProperty("config")) {
        // data comes from server

        payloadLocation = action.payload.data.map(location => {
          location.id = location[":id"];
          return location;
        });
      }

      if (!action.payload.hasOwnProperty("config")) {
        // data comes from indexDB
        //add key ':id' copy 'id' when no config property.
        payloadLocation = Object.keys(action.payload.data).map(key => {
          var tempObj = JSON.parse(JSON.stringify(action.payload.data[key]));
          tempObj[":id"] = action.payload.data[key].id;
          return tempObj;
        });
      }
      return {
        ...state,
        locations: payloadLocation,
        movieDetails: {
          title,
          release_year,
          locations,
          fun_facts,
          production_company,
          distributor,
          director,
          writer,
          actor_1,
          actor_2,
          actor_3,
          id: action.payload.data[0][":id"]
            ? action.payload.data[0][":id"]
            : action.payload.data[0].id
        }
      };
    case FETCH_MOVIE_BY_ROW:
      localStorage.setItem(
        "movieSelected",
        JSON.stringify(action.payload.data)
      );
      return { ...state, selectedMovie: action.payload.data };
    case FETCH_MOVIE_ALL:
      return { ...state, allMoviesPaginated: action.payload.data };
    case CLEAR_MOVIE_AC:
      return { ...state, searchResults: null };
    case CLEAR_MOVIE_HISTORY:
      return state;
    default:
      return state;
  }
}
