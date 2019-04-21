import {
  FETCH_MOVIE_AC,
  FETCH_MOVIE_BY_ROW,
  FETCH_MOVIE_ALL,
  CLEAR_MOVIE_HISTORY,
  FETCH_MOVIE_BY_TITLE,
  CLEAR_MOVIE_AC
} from "../actions/movie_actions";

let initialState = [];

if (localStorage.getItem("movieHistory")) {
  initialState = JSON.parse(localStorage.getItem("movieHistory"));
} else {
  initialState = [];
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_MOVIE_AC:
      return { ...state, searchResults: action.payload.data };
    case FETCH_MOVIE_BY_TITLE:
      localStorage.setItem("movieTitle", JSON.stringify(action.payload.data));
      return {
        ...state,
        locations: action.payload.data,
        movieDetails: action.payload.data[0]
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
