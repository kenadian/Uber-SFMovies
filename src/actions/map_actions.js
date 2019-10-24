import store from "../store";

import { makeInfoWindowContent } from "../functions/map";

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
export const MAP_PLACES = "MAP_PLACES";
export const MAP_GET_LOC_DATA_FROM_IDB = "MAP_GET_LOC_DATA_FROM_IDB";
export const MAP_CLOSE_ALL_INFO_WINDOWS = "MAP_CLOSE_ALL_INFO_WINDOWS";
export const MAP_CLOSE_INFO_WINDOW = "MAP_CLOSE_INFO_WINDOW";
export const MAP_OPEN_INFO_WINDOW = "MAP_OPEN_INFO_WINDOW";
export const MAP_SET_MAP_ON_ONE = "MAP_SET_MAP_ON_ONE";
export const MAP_GET_MARKER = "MAP_GET_MARKER";
export const MAP_HAS_WINDOW = "MAP_HAS_WINDOW";
export const MAP_ZOOM_TO_SF = "MAP_ZOOM_TO_SF";

let movieMap, placesService;
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

export function zoomToSF() {
  movieMap.setCenter(sanFrancisco);
  movieMap.setZoom(calculateZoom());
  return { type: MAP_ZOOM_TO_SF };
}

export function closeAllInfoWindows() {
  movieMap.markers.forEach(marker => {
    marker.infoWindowForMarker.close();
    return true;
  });
  return { type: MAP_CLOSE_ALL_INFO_WINDOWS };
}

export function closeInfoWindow(locId) {
  const marker = movieMap.markers
    .filter(marker => {
      return marker.locId === locId;
    })
    .map(marker => {
      marker.infoWindowForMarker.close();
      return marker;
    })[0];

  return {
    type: MAP_CLOSE_INFO_WINDOW,
    payload: [marker.locId]
  };
}

export function openInfoWindow(locId) {
  const marker = movieMap.markers.filter(marker => {
    return marker.locId === locId;
  });

  if (marker.length > 0) {
    store.dispatch(closeAllInfoWindows());
    marker[0].infoWindowForMarker.open("movieMap", marker[0]);
    return {
      type: MAP_OPEN_INFO_WINDOW,
      payload: [marker[0].locId]
    };
  }

  return {
    type: MAP_OPEN_INFO_WINDOW,
    payload: []
  };
}

// new
export function getMarker(locId) {
  return {
    type: MAP_GET_MARKER,
    payload: movieMap.markers.filter(marker => marker.locId === locId)
  };
}
// new
export function hasWindow(locId) {
  const marker = movieMap.markers.filter(marker => marker.locId === locId);

  const makePayLoad = () => {
    if (marker.length === 0) {
      return false;
    }
    if (marker[0].hasOwnProperty("infoWindowForMarker")) {
      if (marker[0].infoWindowForMarker.hasOwnProperty("anchor")) {
        return marker[0].infoWindowForMarker.anchor !== null;
      }
      return false;
    }
    return false;
  };
  const payload = makePayLoad();
  return {
    type: MAP_HAS_WINDOW,
    payload
  };
}

export function mapPlaces() {
  store.dispatch(toggleIsGettingGooglePlaceResults(false));
  return {
    type: MAP_PLACES
  };
}

export function clearGooglePlaceResults() {
  return {
    type: MAP_CLEAR_GOOGLE_PLACE_RESULTS
  };
}

export function setOnboardingCookie(forever) {
  if (forever === "true") {
    document.cookie =
      "showSFMOverlay=false;expires=Fri, 31 Dec 9999 23:59:59 GMT";
    return {
      type: MAP_SET_ONBOARD_COOKIE
    };
  }
  document.cookie = "showSFMOverlay=false";
  return {
    type: MAP_SET_ONBOARD_COOKIE
  };
}

/**
 * @description initialize the movieMap and set some options.
 *
 */
export function initMap() {
  // let sanFrancisco = new window.google.maps.LatLngLiteral(sanFrancisco)

  movieMap = new window.google.maps.Map(document.getElementById("movieMap"), {
    zoom: calculateZoom(),
    mapTypeControlOptions: {
      style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: window.google.maps.ControlPosition.BOTTOM_CENTER
    },
    center: sanFrancisco,
    markers: [],
    disableDefaultUI: true
  });
  // closes all info windows when the map is clicked
  // this augments the default window close behaviour, click on the 'x'
  window.google.maps.event.addListener(movieMap, "click", function() {
    store.dispatch(closeAllInfoWindows());

    // infoWindowObject.close();
  });
  // window.google.maps.event.addDomListener(window, "resize", initMap);
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
export function getLocationDataFromIdb() {
  return {
    type: MAP_GET_LOC_DATA_FROM_IDB,
    payload: null
  };
}
export function getLocationDataInBackground(movieLocation) {
  placesService = new window.google.maps.places.PlacesService(movieMap);
  const results = new Promise(function(resolve, reject) {
    // Check if the places property has been set indicating the data has been retrieved from indexeddb
    // and can be resolved without querying google

    // TODO remove the check for "places". Perform check in App.js
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
      placesService.findPlaceFromQuery(movieLocation.request, function(
        results,
        status
      ) {
        if (status === "OK") {
          // Use location name from server for marker name
          // If I don't do this the locations listed are
          // different from the marker on initial load.
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
            places: null,
            funFacts: null,
            dataSource: "server",
            name: null
          });
        }
        if (
          status === "OVER_DAILY_LIMIT" ||
          status === "REQUEST_DENIED" ||
          status === "INVALID_REQUEST" ||
          status === "UNKNOWN_ERROR"
        ) {
          console.error(`The server responded with a status of ${status}.`);
          resolve({
            status: status,
            dataSource: "server"
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
  deleteMarkers();

  //Todo make function composable
  //return array of values that have been sucessfully plotted
  const showAllResult = store.getState().maps.googlePlaceResults.map(result => {
    if (result.places === null) {
      return false;
    }
    let imgUrl = "";

    // use the dataSource flag to choose which property
    // to use for the image url, if one exists.
    // TODO the errors are from not filtering the googlePlacesData
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
    // Plot a marker position, imgUrl, funFacts, locName
    store.dispatch(
      createMarker({
        position: result.places[0].geometry.location,
        imgUrl,
        funFacts: result.funFacts,
        locName: result.places[0].name,
        openWindow: false,
        locId: result.id
      })
    );
    return true;
  });

  openInfoWindow(store.getState().movies.markerWindows[0]);
  movieMap.setCenter(sanFrancisco);
  movieMap.setZoom(calculateZoom());

  return {
    type: MAP_SHOW_ALL_LOCATIONS,
    payload: {
      mappedLocationCount: showAllResult.filter(value => {
        return value;
      }).length,
      totalLocationCount: showAllResult.length
    }
  };
}

/**
 *
 * @description builds the marker and places it. Saves marker to array for later use
 * @param {*} place results from google
 * @param {*} imgUrl an image to use
 * @param {*} funFacts raw  from movie database
 */
export function createMarker(markerData) {
  const {
    position,
    imgUrl,
    funFacts,
    locName,
    openWindow = false,
    locId
  } = markerData;
  let marker = [];

  // markersLocNames used for comparing current marker location name to locations already plotted
  //savedMarkers
  const markersLocNames = movieMap.markers.map(value => {
    return value.locName;
  });

  // build the marker and save it to the markers array if this is the first marker plotted
  // or the marker hasn't been plotted before
  if (!markersLocNames.includes(locName) || movieMap.markers.length === 0) {
    store.dispatch(closeAllInfoWindows());
    marker = new window.google.maps.Marker({
      map: movieMap,
      position,
      locName,
      locId
    });
  }

  if (markersLocNames.includes(locName)) {
    marker = movieMap.markers.filter(markerData => {
      return markerData.locName === locName;
    })[0];
  }
  const infoWindowForMarker = infoWindow(
    imgUrl,
    funFacts,
    locName,
    openWindow,
    marker
  );
  marker.infoWindowForMarker = infoWindowForMarker;

  // movieMap.markers used by hide, show, delete widgets
  if (!markersLocNames.includes(locName) || movieMap.markers.length === 0) {
    movieMap.markers.push(marker);
  }

  movieMap.setCenter(position);
  if (window.innerWidth === 375) {
    movieMap.panBy(0, -200);
    movieMap.setZoom(14);
  }
  if (window.innerWidth > 375) {
    movieMap.setZoom(16);
    movieMap.panBy(150, 0);
  }
  const payload = movieMap.markers
    // .filter(marker => marker.locId === locId)
    .map(marker => marker.locId);
  return {
    type: MAP_CREATE_MARKER,
    payload,
    locId
  };
}

export function getLocationData(locName, locationID) {
  const markerData = store
    .getState()
    .maps.googlePlaceResults.filter(row => row.id === locationID)
    .map(loc => {
      return loc.places.map(results => {
        let imgUrl = "";
        if (results.hasOwnProperty("photos")) {
          if (results.photos[0].hasOwnProperty("getUrl")) {
            imgUrl = results.photos[0].getUrl();
          } else {
            imgUrl = results.photos[0].Url;
          }
        } else {
          imgUrl = null;
        }
        return {
          position: results.geometry.location,
          imgUrl,
          funFacts: loc.funFacts,
          locName,
          openWindow: true
        };
      });
    });

  return { type: MAP_GET_LOCATION_DATA, payload: markerData };
}

export function setMapOnAll(theMap) {
  for (var i = 0; i < movieMap.markers.length; i++) {
    movieMap.markers[i].setMap(theMap);
  }

  return {
    type: MAP_SET_MAP_ON_ALL
  };
}
export function setMapOnOne(locId) {
  const markerToRemove = movieMap.markers.filter(
    marker => marker.locId === locId
  )[0];
  markerToRemove.setMap(null);

  movieMap.markers = movieMap.markers.filter(marker => marker.locId !== locId);

  return {
    type: MAP_SET_MAP_ON_ONE,
    payload: locId
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
  movieMap.markers = [];
  return {
    type: MAP_DELETE_MARKERS
  };
}
const infoWindow = (imgUrl, funFacts, locName, openWindow, marker) => {
  const infoWindowContent = makeInfoWindowContent({
    imgUrl,
    width: "250px",
    // height: '',
    funFacts,
    locName
  }); //builds html for infoWindow

  const infoWindowObject = new window.google.maps.InfoWindow({
    content: infoWindowContent,
    maxWidth: 300
  });
  // display the info window if markerData.openWindow:true

  if (openWindow) {
    infoWindowObject.open(movieMap, marker);
  }

  // opens info window when marker is clicked
  window.google.maps.event.addListener(marker, "click", function() {
    store.dispatch(openInfoWindow(marker.locId));
    // infoWindowObject.setContent(infoWindowContent);
    // infoWindowObject.open(movieMap, marker);
  });

  return infoWindowObject;
};
