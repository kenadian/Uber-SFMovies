import {
  FETCH_MOVIE_AC,
  FETCH_MOVIE_BY_ROW,
  FETCH_MOVIE_ALL,
  CLEAR_MOVIE_HISTORY,
  FETCH_MOVIE_BY_TITLE,
  CLEAR_MOVIE_AC,
  MOVIE_GET_VIEWED_TITLES
} from "../actions/movie_actions";

let initialState = {
  searchResults: [],
  viewedTitles: [],
  locations: [],
  movieDetails: {}
};
//TODO I think this is unnesecary
// if (localStorage.getItem("movieHistory")) {
//   initialState = JSON.parse(localStorage.getItem("movieHistory"));
// } else {
//   initialState = [];
// }

export default function(state = initialState, action) {
  //
  switch (action.type) {
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

        payloadLocation = action.payload.data;
      }

      if (!action.payload.hasOwnProperty("config")) {
        // data comes from indexDB

        //add key ':id' copy 'id' when no config property
        payloadLocation = Object.keys(action.payload.data).map(key => {
          // return;
          var tempObj = JSON.parse(JSON.stringify(action.payload.data[key]));
          // let tempObj = Object.create(action.payload.data[key]);
          tempObj[":id"] = action.payload.data[key].id;
          return tempObj;
        });
      }

      // TODO Rename movieDetails to Current Movie
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
