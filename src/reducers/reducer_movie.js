import {
  FETCH_MOVIE_AC,
  FETCH_MOVIE_BY_ROW,
  FETCH_MOVIE_ALL,
  CLEAR_MOVIE_HISTORY
} from "../actions/movie_actions";

let initialState = [];

if (localStorage.getItem("movieHistory")) {
  initialState = JSON.parse(localStorage.getItem("movieHistory"));
} else {
  initialState = [];
}

export default function(state = initialState, action) {
  console.log(action.payload);
  switch (action.type) {
    case FETCH_MOVIE_AC:
      return { ...state, autocompleteMovies: action.payload.data };

    case FETCH_MOVIE_BY_ROW:
      localStorage.setItem(
        "movieSelected",
        JSON.stringify(action.payload.data)
      );
      return { ...state, selectedMovie: action.payload.data };
    case FETCH_MOVIE_ALL:
      return { ...state, allMoviesPaginated: action.payload.data };
    case CLEAR_MOVIE_HISTORY:
      return state;
    default:
      return state;
  }
}
