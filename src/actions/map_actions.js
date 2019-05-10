import { store } from "../index";

export const MAP_INIT = "MAP_INIT";
export const MAP_LOCATIONS = "MAP_LOCATIONS";
export const MAP_CREATE_MARKER = "MAP_CREATE_MARKER";
export const MAP_GET_LOCATION_DATA = "MAP_GET_LOCATION_DATA";
export const MAP_SET_MAP_ON_ALL = "MAP_SET_MAP_ON_ALL";
export const MAP_CLEAR_MARKERS = "MAP_CLEAR_MARKERS";
export const MAP_SHOW_MARKERS = "MAP_SHOW_MARKERS";

export const MAP_DELETE_MARKERS = "MAP_DELETE_MARKERS";
export const MAP_GET_LOC_DATA_IN_BG = "MAP_GET_LOC_DATA_IN_BG";
export const MAP_FIND_PLACE_RESULTS = "MAP_FIND_PLACE_RESULTS";
export const MAP_FIND_PLACE_RESULTS_OVERLIMIT =
  "MAP_FIND_PLACE_RESULTS_OVERLIMIT";
export const MAP_RESET_PLACE_RESULTS_OVERLIMIT =
  "MAP_RESET_PLACE_RESULTS_OVERLIMIT";
export const MAP_FIND_PLACE_ZERO_RESULTS = "MAP_FIND_PLACE_ZERO_RESULTS";
export const MAP_SAVE_PLACES_LOCALSTORAGE = "MAP_SAVE_PLACES_LOCALSTORAGE";
export const MAP_SHOW_ALL_LOCATIONS = "MAP_SHOW_ALL_LOCATIONS";
let map, service, infowindow;
let markers = [];

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
export function savePlacesToLocalStorage() {
  console.log("save to local", store.getState().maps.googlePlaceResults.length);
  // TODO add an id to googlePlaceResults to make it possible to compare the
  // searched movie with the movies in local storage.
  // {id:location[':id'],
  //  results: [store.getState().maps.googlePlaceResults] }
  // localStorage.setItem()
  return {
    type: MAP_SAVE_PLACES_LOCALSTORAGE
  };
}
/**
 * @description initialize the map and set some options.
 *
 */
export function initMap() {
  let sanFrancisco = new window.google.maps.LatLng(37.7749295, -122.4364155);

  map = new window.google.maps.Map(document.getElementById("myMap"), {
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

export function findPlaceResults(result) {
  return {
    type: MAP_FIND_PLACE_RESULTS,
    payload: result
  };
}

export function findPlaceResultsOverlimit(result) {
  return {
    type: MAP_FIND_PLACE_RESULTS_OVERLIMIT,
    payload: result
  };
}

export function findPlaceZeroResults(result) {
  return {
    type: MAP_FIND_PLACE_ZERO_RESULTS,
    payload: result
  };
}

export function resetPlaceResultsOverlimit() {
  return {
    type: MAP_RESET_PLACE_RESULTS_OVERLIMIT
  };
}

function processLocations(locations) {
  locations.forEach((movieLocation, index) => {
    service.findPlaceFromQuery(movieLocation.request, function(
      results,
      status
    ) {
      if (status === "OK") {
        for (let i = 0; i < results.length; i++) {
          store.dispatch(
            findPlaceResults({
              places: results[i],
              photo: results[0].hasOwnProperty("photos")
                ? results[0].photos[0].getUrl()
                : null,
              funFacts: movieLocation.fun_facts
            })
          );
        }
      }
      if (status === "OVER_QUERY_LIMIT") {
        //dispatch action to store these in state until they can be retried
        store.dispatch(
          findPlaceResultsOverlimit({
            request: movieLocation.request
          })
        );
      }
      if (status === "ZERO_RESULTS") {
        //dispatch action to store these in state until they can be retried
        store.dispatch(
          findPlaceZeroResults({
            locationDetails: movieLocation.locationDetails
          })
        );
      }
    });
  });
}

export function getLocationDataInBackground(locations) {
  let intervalID = window.setInterval(myCallback, 350);
  service = new window.google.maps.places.PlacesService(map);
  function myCallback() {
    if (locations.length > 0) {
      processLocations([locations.pop()]);
    } else {
      clearInterval(intervalID);
    }
  }

  return {
    type: MAP_GET_LOC_DATA_IN_BG,
    payload: false
  };
}

export function mapLocations(locations2) {
  const requestLocations = locations2
    .map(value => ({
      query: `${value.locations} San Francisco`,
      fields: ["name", "opening_hours", "photos", "geometry"]
    }))
    .forEach((value, index) => {});

  return {
    type: MAP_LOCATIONS
  };
}
export function showAllLocations() {
  return {
    type: MAP_SHOW_ALL_LOCATIONS
  };
}
/**
 *
 * @description builds the marker and places it. Saves marker to array for later use
 * @param {*} place results from google
 * @param {*} imgUrl an image to use
 * @param {*} funFacts raw from movie database
 */
export function createMarker(place, imgUrl, funFacts) {
  const placeImage = imgUrl ? `<img src=${imgUrl} width="250px" />` : "";
  const funFactsLayout = funFacts ? `<div>${funFacts}</div>` : "";
  const markerWindowContent = `<div >
                                    ${placeImage}
                                    <div>${place.name}</div>
                                      ${funFactsLayout}
                                  </div>`;

  infowindow = new window.google.maps.InfoWindow({ maxWidth: 300 });

  map.setCenter(place.geometry.location);
  const marker = new window.google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  window.google.maps.event.addListener(map, "click", function() {
    infowindow.close();
  });
  window.google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(markerWindowContent);
    infowindow.open(map, marker);
  });

  markers.push(marker);
  return {
    type: MAP_CREATE_MARKER
  };
}
export function getLocationData(locations) {
  service = new window.google.maps.places.PlacesService(map);

  const request = {
    query: `${locations} San Francisco`,
    fields: ["name", "opening_hours", "photos", "geometry"]
  };

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === "OK") {
      for (let i = 0; i < results.length; i++) {
        createMarker(
          results[i],
          results[0].hasOwnProperty("photos")
            ? results[0].photos[0].getUrl()
            : null,
          locations.fun_facts
        );
      }
    }
  });

  return { type: MAP_GET_LOCATION_DATA };
}
export function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  return {
    type: MAP_SET_MAP_ON_ALL
  };
}

// Removes the markers from the map, but keeps them in the array.
export function clearMarkers() {
  setMapOnAll(null);
  return {
    type: MAP_CLEAR_MARKERS
  };
}

// Shows any markers currently in the array.
export function showMarkers() {
  setMapOnAll(map);
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
