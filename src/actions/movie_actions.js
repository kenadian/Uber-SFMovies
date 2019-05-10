import axios from "axios";
import mapLocations from "./map_actions";

export const FETCH_MOVIE_AC = "FETCH_MOVIE_AC";
export const FETCH_MOVIE_BY_ROW = "FETCH_MOVIE_BY_ROW";
export const FETCH_MOVIE_BY_TITLE = "FETCH_MOVIE_BY_TITLE";
export const FETCH_MOVIE_ALL = "FETCH_MOVIE_ALL";
export const CLEAR_MOVIE_AC = "CLEAR_MOVIE_AC";
export const CLEAR_MOVIE_HISTORY = "CLEAR_MOVIE_HISTORY";

export function fetchMovieAC(term) {
  const query = encodeURIComponent(
    `SELECT distinct title WHERE lower(title) like '%${term.toLowerCase()}%' and locations IS NOT NULL`
  );

  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$query=${query}`;

  const request = axios
    .get(url, {
      headers: {}
    })
    .catch(err => {
      localStorage.setItem("savedSearch", url);
      console.error(`Problem getting your movie locations${err}`);
    });
  return {
    type: FETCH_MOVIE_AC,
    payload: request
  };
}

export function fetchByTitle(term) {
  const query = encodeURIComponent(
    `SELECT *, :id WHERE title like '%${term}%'`
  );
  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$query=${query}`;
  const request = axios.get(url, {
    headers: {}
  });

  return {
    type: FETCH_MOVIE_BY_TITLE,
    payload: request
  };
}

export function fetchMovieByRow(rowId) {
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
  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$order=${sort}%20${order}&$limit=20&$offset=100`;
  const request = axios.get(url, {
    headers: {}
  });

  return {
    type: FETCH_MOVIE_ALL,
    payload: request
  };
}
export function clearMovieAC() {
  return {
    type: CLEAR_MOVIE_AC
  };
}
export function clearMovieHistory(barcode) {
  return {
    type: CLEAR_MOVIE_HISTORY
  };
}
