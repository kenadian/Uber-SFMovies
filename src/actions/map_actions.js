import { store } from "../index";

export const MAP_INIT = "MAP_INIT";
export const MAP_CREATE_MARKER = "MAP_CREATE_MARKER";
export const MAP_GET_LOCATION_DATA = "MAP_GET_LOCATION_DATA";
export const MAP_SET_MAP_ON_ALL = "MAP_SET_MAP_ON_ALL";
export const MAP_CLEAR_MARKERS = "MAP_CLEAR_MARKERS";
export const MAP_SHOW_MARKERS = "MAP_SHOW_MARKERS";
export const IS_GETTING_GOOGLE_PLACE_RESULTS =
  "IS_GETTING_GOOGLE_PLACE_RESULTS";
export const MAP_DELETE_MARKERS = "MAP_DELETE_MARKERS";
export const MAP_GET_LOC_DATA_IN_BG = "MAP_GET_LOC_DATA_IN_BG";
export const MAP_CLEAR_GOOGLE_PLACE_RESULTS = "MAP_CLEAR_GOOGLE_PLACE_RESULTS";
export const MAP_SAVE_PLACES_LOCALSTORAGE = "MAP_SAVE_PLACES_LOCALSTORAGE";
export const MAP_SHOW_ALL_LOCATIONS = "MAP_SHOW_ALL_LOCATIONS";
export const MAP_SET_ONBOARD_COOKIE = "MAP_SET_ONBOARD_COOKIE";

let movieMap, service, infowindow;
let markers = [];
let sanFrancisco = { lat: 37.7749295, lng: -122.4364155 };
/**
 * @description Calculates a value for zoom based on innerWidth
 *
 * @returns number
 */
function calculateZoom() {
  //TODO Make this better. Maybe access the material ui theme.
  // Pass the theme.breakpoints object or import here

  const large = 1024;

  const small = 600;
  const width = window.innerWidth;
  if (width > large) {
    return 13;
  }
  if (width <= large && width >= small) {
    return 12;
  }
  if (width < small) return 11.2;
  return 13;
}

export function clearGooglePlaceResults() {
  return {
    type: MAP_CLEAR_GOOGLE_PLACE_RESULTS
  };
}
export function setOnboardingCookie() {
  document.cookie = "showSFMOverlay=false";
  return {
    type: MAP_SET_ONBOARD_COOKIE
  };
}

//TODO This is likely not needed
export function savePlacesToLocalStorage() {
  return {
    type: MAP_SAVE_PLACES_LOCALSTORAGE
  };
}
/**
 * @description initialize the movieMap and set some options.
 *
 */
export function initMap() {
  // let sanFrancisco = new window.google.maps.LatLngLiteral(sanFrancisco)

  movieMap = new window.google.maps.Map(document.getElementById("myMap"), {
    zoom: calculateZoom(),
    mapTypeControlOptions: {
      style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: window.google.maps.ControlPosition.BOTTOM_CENTER
    },
    center: sanFrancisco
  });
  window.google.maps.event.addDomListener(window, "resize", initMap);
  return {
    type: MAP_INIT
  };
}

export function toggleIsGettingGooglePlaceResults(value) {
  return {
    type: IS_GETTING_GOOGLE_PLACE_RESULTS,
    payload: value
  };
}

export function getLocationDataInBackground(movieLocation) {
  service = new window.google.maps.places.PlacesService(movieMap);

  const results = new Promise(function(resolve, reject) {
    // Check if the places property has been set indicating the data has been retrieved from indexeddb
    // and can be resolved without querying google

    if (movieLocation.locationDetails.hasOwnProperty("places")) {
      resolve({
        id: movieLocation.locationDetails[":id"]
          ? movieLocation.locationDetails[":id"]
          : movieLocation.locationDetails.id,
        status: "OK",
        places: [movieLocation.locationDetails.places],
        funFacts: movieLocation.locationDetails.fun_facts,
        dataSource: "db"
      });
      return;
    }
    if (!movieLocation.locationDetails.hasOwnProperty("places")) {
      service.findPlaceFromQuery(movieLocation.request, function(
        results,
        status
      ) {
        //TODO Trap for all status possibilities
        if (status === "OK") {
          // Use location name from server for marker name
          // If I don't do this the locations listed are different from the marker
          // on initial load.
          results["0"].name = movieLocation.locationDetails.locations;

          resolve({
            id: movieLocation.locationDetails[":id"]
              ? movieLocation.locationDetails[":id"]
              : movieLocation.locationDetails.id,
            status: status,
            places: results,
            funFacts: movieLocation.locationDetails.fun_facts,
            dataSource: "server",
            name: movieLocation.name
          });
        }
        if (status === "OVER_QUERY_LIMIT") {
          resolve({
            id: movieLocation.locationDetails[":id"]
              ? movieLocation.locationDetails[":id"]
              : movieLocation.locationDetails.id,
            status: status,
            request: movieLocation.request,
            dataSource: "server"
          });
        }
        if (status === "ZERO_RESULTS") {
          resolve({
            id: movieLocation.locationDetails[":id"]
              ? movieLocation.locationDetails[":id"]
              : movieLocation.locationDetails.id,
            status: status,
            locationDetails: movieLocation.locationDetails,
            dataSource: "server",
            name: movieLocation.name
          });
        }
      });
    }
  });

  return {
    type: MAP_GET_LOC_DATA_IN_BG,
    payload: results
  };
}

export function showAllLocations() {
  //Todo make function composable
  //return array of values that have been sucessfully plotted
  store.getState().maps.googlePlaceResults.map(result => {
    let imgUrl = "";

    if (result.dataSource === "server") {
      imgUrl = result.places[0].hasOwnProperty("photos")
        ? result.places[0].photos[0].getUrl()
        : null;
    }
    if (result.dataSource === "db") {
      imgUrl = result.places[0].hasOwnProperty("photos")
        ? result.places[0].photos[0].Url
        : null;
    }
    store.dispatch(
      createMarker(
        result.places[0],
        imgUrl,
        result.funFacts,
        result.places[0].name
      )
    );
    movieMap.setCenter(sanFrancisco);
    movieMap.setZoom(calculateZoom());
  });

  return {
    type: MAP_SHOW_ALL_LOCATIONS
  };
}
/**
 *
 * @description builds the marker and places it. Saves marker to array for later use
 * @param {*} place results from google
 * @param {*} imgUrl an image to use
 * @param {*} funFacts raw  from movie database
 */
export function createMarker(place, imgUrl, funFacts, locName) {
  // TODO Customize the marker and window content
  const placeImage = imgUrl ? `<img src=${imgUrl} width="250px" />` : "";
  const funFactsLayout = funFacts ? `<div>${funFacts}</div>` : "";
  const markerWindowContent = `<div>
                                    ${placeImage}
                                    <h2>${locName}<h2>
                                      ${funFactsLayout}
                                  </div>`;

  infowindow = new window.google.maps.InfoWindow({ maxWidth: 300 });

  movieMap.setCenter(place.geometry.location);
  const marker = new window.google.maps.Marker({
    map: movieMap,
    position: place.geometry.location
  });
  window.google.maps.event.addListener(movieMap, "click", function() {
    infowindow.close();
  });
  window.google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(markerWindowContent);
    infowindow.open(movieMap, marker);
  });
  markers.push(marker);
  movieMap.setZoom(16);

  return {
    type: MAP_CREATE_MARKER
  };
}
export function getLocationData(locations, locationID) {
  store
    .getState()
    .maps.googlePlaceResults.filter(row => row.id === locationID)
    .map(loc => {
      loc.places.map(results => {
        let photoUrl = "";
        if (results.hasOwnProperty("photos")) {
          if (results.photos[0].hasOwnProperty("getUrl")) {
            photoUrl = results.photos[0].getUrl();
          } else {
            photoUrl = results.photos[0].Url;
          }
        } else {
          photoUrl = null;
        }
        createMarker(results, photoUrl, loc.fun_facts, locations);
      });
    });

  return { type: MAP_GET_LOCATION_DATA };
}
export function setMapOnAll(movieMap) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(movieMap);
  }
  return {
    type: MAP_SET_MAP_ON_ALL
  };
}

// Removes the markers from the movieMap, but keeps them in the array.
export function clearMarkers() {
  setMapOnAll(null);
  return {
    type: MAP_CLEAR_MARKERS
  };
}

// Shows any markers currently in the array.
export function showMarkers() {
  setMapOnAll(movieMap);
  return {
    type: MAP_SHOW_MARKERS
  };
}

// Deletes all markers in the array by removing references to them.
export function deleteMarkers() {
  store.dispatch(clearMarkers());
  markers = [];
  return {
    type: MAP_DELETE_MARKERS
  };
}
