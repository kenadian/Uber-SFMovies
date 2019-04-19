import axios from "axios";

export const FETCH_MOVIE_AC = "FETCH_MOVIE_AC";
export const FETCH_MOVIE_BY_ROW = "FETCH_MOVIE_BY_ROW";
export const FETCH_MOVIE_ALL = "FETCH_MOVIE_ALL";
export const CLEAR_MOVIE_HISTORY = "CLEAR_MOVIE_HISTORY";

export function fetchMovieAC(term) {
  //https://data.sfgov.org/resource/wwmu-gmzc.json?$where=title like '%18%'
  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$query=SELECT%20*,%20:id%20WHERE%20title%20like%20%27%25${term}%25%27`;
  const request = axios.get(url, {
    headers: {}
  });

  return {
    type: FETCH_MOVIE_AC,
    payload: request
  };
}
export function fetchMovieByRow(rowId) {
  //TODO change url to correct endpoint parameters
  const url = `https://data.sfgov.org/resource/wwmu-gmzc/${rowId}.json`;
  const request = axios.get(url, {
    headers: {}
  });

  return {
    type: FETCH_MOVIE_BY_ROW,
    payload: request
  };
}

export function fetchMovieAll(sort, order = "ASC") {
  //TODO change url to correct endpoint parameters
  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$order=${sort}%20${order}&$limit=20&$offset=100`;
  const request = axios.get(url, {
    headers: {}
  });

  return {
    type: FETCH_MOVIE_ALL,
    payload: request
  };
}

export function clearMovieHistory(barcode) {
  return {
    type: CLEAR_MOVIE_HISTORY
  };
}
