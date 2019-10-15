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

export function getMovieFromIDB(title) {
  const db = openMoviesIDB();

  return db.then(async db => {
    // If we get results it saves us going to the server.
    // Movie data isn't expected to change
    return db.getAllFromIndex("locations", "title", title);
  });
}
export function getAllMoviesFromIDB() {
  const db = openMoviesIDB();
  return db.then(async db => {
    return await db.getAll("locations");
  });
}
export function deleteMovieFromIDB(title) {
  const db = openMoviesIDB();
  return db.then(async db => {
    // const result = await db.get("locations", "row-2p53_x7av~r824");
    const titles = await db.getAllFromIndex("locations", "title", title);

    titles.forEach(async movie => {
      await db.delete("locations", movie.id);
    });

    return await getAllMoviesFromIDB();
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
