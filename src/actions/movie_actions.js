import axios from "axios";
import store from "../store";
import {
  openMoviesIDB,
  getMovieFromIDB,
  writeMovieToIDB,
  deleteMovieFromIDB
} from "../functions/idb";
export const FETCH_MOVIE_AC = "FETCH_MOVIE_AC";
export const FETCH_MOVIE_BY_ROW = "FETCH_MOVIE_BY_ROW";
export const FETCH_MOVIE_BY_TITLE = "FETCH_MOVIE_BY_TITLE";
export const FETCH_MOVIE_ALL = "FETCH_MOVIE_ALL";
export const CLEAR_MOVIE_AC = "CLEAR_MOVIE_AC";
export const CLEAR_MOVIE_HISTORY = "CLEAR_MOVIE_HISTORY";
export const MOVIE_GET_VIEWED_TITLES = "MOVIE_GET_VIEWED_TITLES";
export const MOVIE_DELETE_VIEWED_TITLES = "MOVIE_DELETE_VIEWED_TITLES";

export function fetchMovieAC(term) {
  const query = encodeURIComponent(
    `SELECT distinct title WHERE lower(title) like "%${term}%" and locations IS NOT NULL`
  );
  // endpoint for san francisco movie data
  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$query=${query}`;

  const request = axios.get(url).catch(err => {
    localStorage.setItem("savedSearch", url);
    console.error(`Problem getting your movie locations. ${err}`);
  });
  return {
    type: FETCH_MOVIE_AC,
    payload: request
  };
}
export async function getViewedTitles() {
  const db = openMoviesIDB();
  const result = await db.then(async db => {
    const tx = db.transaction("locations", "readwrite");
    const store = tx.objectStore("locations");

    return await store.getAll().then(result => {
      const tempId = [];

      const distinctIndex = result
        .map(loc => {
          if (tempId.indexOf(loc.title) < 0) {
            tempId.push(loc.title);
            return { id: loc.id, title: loc.title };
          }
          return false;
        })
        .filter((value, index, self) => {
          return value;
        });

      return distinctIndex;
    });
  });

  return { type: MOVIE_GET_VIEWED_TITLES, payload: result };
}
export async function deleteViewedTitles(title) {
  const results = await deleteMovieFromIDB(title);

  return { type: MOVIE_DELETE_VIEWED_TITLES, payload: results };
}
export async function fetchByTitle(term) {
  return getMovieFromIDB(term).then(result => {
    // If we get results from indexedDb it saves us going to the server.
    // Movie data isn't expected to change
    if (result.length > 0) {
      return {
        type: FETCH_MOVIE_BY_TITLE,
        payload: { data: [...result], dataSource: "db" }
      };
    }
    // Nothing in indexDb so let's query the server
    // If we get this far then the result length is probably zero
    // but might as well check it in case something didn't work

    if (result.length === 0) {
      return getMovieFromServer(term)
        .then(movie => {
          const filteredMovie = filterDuplicateLocations(movie.data);
          movie.data = filteredMovie;
          // Easiest to set the dataSource here
          movie.dataSource = "server";
          return movie;
        })
        .then(async movie => {
          await writeMovieToIDB(movie);
          return movie;
        })
        .then(movie => {
          return {
            type: FETCH_MOVIE_BY_TITLE,
            payload: movie
          };
        });
    }
  });
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

export function fetchMovieAll(sort = "title", order = "ASC") {
  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$order=title%20${order}`;
  const request = axios.get(url);

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
function getMovieFromServer(term) {
  const query = encodeURIComponent(
    `SELECT *, :id WHERE title like "%${term}%"`
  );
  const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$query=${query}`;
  return axios
    .get(url, {
      headers: {}
    })
    .catch(err =>
      console.error(
        "Unable to retrieve data from the server as expected. Look at the error for more info.",
        err
      )
    );
}

export function filterDuplicateLocations(locationArray = []) {
  let comparisonArray = [];
  return locationArray.filter((value, index) => {
    if (comparisonArray.indexOf(value.locations) > -1) {
      return false;
    }
    comparisonArray.push(value.locations);
    return true;
  });
}
