import { openDB } from "idb/with-async-ittr.js";
export function openMoviesIDB() {
  return openDB("movies", 1, {
    upgrade(db) {
      const store = db.createObjectStore("locations", {
        // The 'id' property of the result will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true
      });
      store.createIndex("title", "title");
    }
  });
}

export async function getMovieFromIDB(term) {
  const db = openMoviesIDB();

  return await db.then(async db => {
    // If we get results it saves us going to the server.
    // Movie data isn't expected to change
    return await db.getAllFromIndex("locations", "title", term);
  });
}

export function writeMovieToIDB(movies) {
  movies.data.map(loc => {
    // The :id property is tough to destructure so
    //  It's referenced later as loc[":id"]

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

    const db = openMoviesIDB();

    db.then(async db => {
      const tx = db.transaction("locations", "readwrite");
      const store = tx.objectStore("locations");
      // Try to get the movie from the database
      const value = await store.get(loc[":id"]).then(result => result);

      // If movie isn't in indexedDb then add it
      if (!value) {
        store
          .add({
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
            id: loc[":id"]
          })
          .catch((error, tx) => {
            console.error(`Adding movie to indexdDb failed. ${error}`);
            tx.abort();
          });

        await tx.done;
      }
    }).catch(error => {
      console.error(`Add movie location to IndexDB didn't work. ${error}`);
    });
    return true;
  });
}
