import axios from "axios";

import { openDB } from "idb/with-async-ittr.js";
export const FETCH_MOVIE_AC = "FETCH_MOVIE_AC";
export const FETCH_MOVIE_BY_ROW = "FETCH_MOVIE_BY_ROW";
export const FETCH_MOVIE_BY_TITLE = "FETCH_MOVIE_BY_TITLE";
export const FETCH_MOVIE_ALL = "FETCH_MOVIE_ALL";
export const CLEAR_MOVIE_AC = "CLEAR_MOVIE_AC";
export const CLEAR_MOVIE_HISTORY = "CLEAR_MOVIE_HISTORY";
export const MOVIE_GET_VIEWED_TITLES = "MOVIE_GET_VIEWED_TITLES";

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
export async function getViewedTitles() {
  const db = openDB("movies", 1, {
    upgrade(db) {
      // const tx = db.transaction("locations", "readwrite");
      const store = db.createObjectStore("locations", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true
      });
      store.createIndex("title", "title");
    }
  });
  const result = await db.then(async db => {
    const tx = db.transaction("locations", "readwrite");
    const store = tx.objectStore("locations");
    // get distinct titles
    return await store.getAll().then(result => {
      return result
        .map(loc => loc.title)
        .filter((value, index, self) => {
          // result.indexOf(value) === index
          // if the index value of the current value in the array being filtered
          // is not the same as the current index then the value is not unique since
          // it can be found elsewhere in the array.
          //https://appdividend.com/2019/04/11/how-to-get-distinct-values-from-array-in-javascript/
          return self.indexOf(value) === index; // get distinct titles only
        });
    });
  });
  return { type: MOVIE_GET_VIEWED_TITLES, payload: result };
}

export async function fetchByTitle(term) {
  const db = openDB("movies", 1, {
    upgrade(db) {
      // const tx = db.transaction("locations", "readwrite");
      const store = db.createObjectStore("locations", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true
      });
      store.createIndex("title", "title");
    }
  });

  return await db.then(async db => {
    const tx = db.transaction("locations", "readwrite");
    const store = tx.objectStore("locations");

    const value = await db.getAllFromIndex("locations", "title", term);
    if (value.length > 0) {
      return {
        type: FETCH_MOVIE_BY_TITLE,
        payload: { data: [...value], dataSource: "db" }
      };
    }
    if (value.length === 0) {
      const query = encodeURIComponent(
        `SELECT *, :id WHERE title like '%${term}%'`
      );
      const url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$query=${query}`;
      const request = axios.get(url, {
        headers: {}
      });

      return request
        .then(request => {
          request.data.dataSource = "server";
          return request;
        })
        .then(movies => {
          movies.data.map(loc => {
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
            } = loc;

            const db = openDB("movies", 1, {
              upgrade(db) {
                // const tx = db.transaction("locations", "readwrite");
                const store = db.createObjectStore("locations", {
                  // The 'id' property of the object will be the key.
                  keyPath: "id",
                  // If it isn't explicitly set, create a value by auto incrementing.
                  autoIncrement: true
                });
                store.createIndex("title", "title");
              }
            });

            db.then(async db => {
              const tx = db.transaction("locations", "readwrite");
              const store = tx.objectStore("locations");
              const value = await store.get(loc[":id"]).then(result => result);
              //
              if (!value) {
                store
                  .add({
                    title: title,
                    release_year: release_year,
                    locations: locations,
                    fun_facts: fun_facts,
                    production_company: production_company,
                    distributor: distributor,
                    director: director,
                    writer: writer,
                    actor_1: actor_1,
                    actor_2: actor_2,
                    actor_3: actor_3,
                    id: loc[":id"]
                  })

                  .catch((error, tx) => {
                    console.error(`add failed ${error}`);
                    tx.abort();
                  });
                await tx.done;
              }
            }).catch(error => {
              console.error(
                `Add movie location to IndexDB didn't work. ${error}`
              );
            });
          });
          return movies;
        })
        .then(request => {
          return {
            type: FETCH_MOVIE_BY_TITLE,
            payload: request
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
