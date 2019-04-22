import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import MainMap from "./components/map.js";
import SearchBar from "./components/searchBar";
import ToolDrawer from "./components/toolDrawer";
import OnboardOverlay from "./components/onboardOverlay";
import {
  fetchMovieAC,
  fetchMovieByRow,
  fetchMovieAll,
  clearMovieHistory
} from "./actions/movie_actions";

let map, service, infowindow;
let markers = [];
let badLocations = [];

/**
 * @description initialize the map and set some options.
 *
 */
function initMap() {
  let sanFrancisco = new window.google.maps.LatLng(37.7749295, -122.4364155);
  map = new window.google.maps.Map(document.getElementById("myMap"), {
    zoom: 13,
    mapTypeControlOptions: {
      style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: window.google.maps.ControlPosition.BOTTOM_CENTER
    },
    center: sanFrancisco
  });
}

/**
 *
 * @description calls getLocationFromGoogle for each location.
 * Calls are throttled to prevent exceeding limits. 350 seems to work.
 * @param {*} locations
 */
function getLocationData(locations) {
  service = new window.google.maps.places.PlacesService(map);

  locations.forEach((movieLocation, index) => {
    setTimeout(function() {
      getLocationFromGoogle(movieLocation);
    }, 350 * (index + 1));
  });
  let sanFrancisco = new window.google.maps.LatLng(37.7749295, -122.4364155);
  map.setCenter(sanFrancisco);
  map.setZoom(13);
}

/**
 *
 * @description gets location data using raw location string and
 * calls createMarker with results to build markers.
 * If the location isn't found using the raw location a second attempt
 * is made using the string found in parentheses, a common way this
 * data set uses to add specificity to the location. If this fails the location is
 * saved to an array for display in the UI and logged as an error in the console.
 * TODO Clean up the duplication
 * @param {*} movieLocation
 */
function getLocationFromGoogle(movieLocation) {
  // build the request object. Here I append San Francisco to try to improve accuracy
  // I tested it on a couple of movies and it provided better results than locationBias property
  // set to the sanFrancisco coordinates. Same for the second try.
  const request = {
    query: `${movieLocation.locations} San Francisco`,
    fields: ["name", "opening_hours", "photos", "geometry"]
  };

  service.findPlaceFromQuery(request, function(results, status) {
    // Bit of a sanity check here. I need more of these.
    if (
      status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
    ) {
      console.error(`Google says your over your ${status}`);
    }
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        // I was thrilled to learn that I could get a photo of the Google.
        // I want the fun_facts in the infowindow so pass it as well.
        createMarker(
          results[i],
          results[0].hasOwnProperty("photos")
            ? results[0].photos[0].getUrl()
            : null,
          movieLocation.fun_facts
        );
      }
    } else {
      // Couldn't find the location
      // Save bad address for later use
      const currentBadLocation = request.query;
      // regex to get string inside parentheses
      const regExp = /\(([^)]+)\)/;
      let secondTryQuery = regExp.exec(request.query);
      // only try if there was a string in parentheses
      if (secondTryQuery) {
        const secondRequest = {
          query: `${secondTryQuery[1]} San Francisco`,
          fields: ["name", "opening_hours", "photos", "geometry"]
        };
        service.findPlaceFromQuery(secondRequest, function(results, status) {
          if (
            status ===
            window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
          ) {
            console.error(`Google says your over your ${status} again`);
          }
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              createMarker(
                results[i],
                results[0].hasOwnProperty("photos")
                  ? results[0].photos[0].getUrl()
                  : null,
                movieLocation.fun_facts
              );
            }
          }
        });
      } else {
        badLocations.push(request.query);
        console.error(`Couldn't find ${currentBadLocation}`);
      }
    }
  });
}
/**
 *
 * @description builds the marker and places it. Saves marker to array for later use
 * @param {*} place results from google
 * @param {*} imgUrl an image to use
 * @param {*} funFacts raw from movie database
 */
function createMarker(place, imgUrl, funFacts) {
  const placeImage = imgUrl ? `<img src=${imgUrl} width="250px" />` : "";
  const funFactsLayout = funFacts ? `<div>${funFacts}</div>` : "";
  const markerWindowContent = `<div >
                                  ${placeImage}
                                  <div>${place.name}</div>
                                    ${funFactsLayout}
                                </div>`;
  //TODO Add formatted fun facts from location to info window
  infowindow = new window.google.maps.InfoWindow({ maxWidth: 300 });
  const marker = new window.google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  window.google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(markerWindowContent);
    infowindow.open(map, marker);
  });
  markers.push(marker);
}
/**
 * @description It puts the markers on the map.
 *
 * @param {*} map the map
 */
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

class App extends Component {
  state = { open: false, showOverlay: true };
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  handleOverlayClose = () => {
    //TODO add localstorage variable to prevent this from showing again
    localStorage.setItem("showSFMOverlay", false);
    this.setState({ showOverlay: false });
  };
  render() {
    return (
      <div className="App">
        {this.state.showOverlay &&
          localStorage.getItem("showSFMOverlay") === null && (
            <OnboardOverlay handleOverlayClose={this.handleOverlayClose} />
          )}
        <ToolDrawer
          open={this.state.open}
          handleDrawerClose={this.handleDrawerClose}
          deleteMarkers={deleteMarkers}
          clearMarkers={clearMarkers}
          showMarkers={showMarkers}
        />
        <SearchBar
          deleteMarkers={deleteMarkers}
          getLocationData={getLocationData}
          handleDrawerClose={this.handleDrawerClose}
          handleDrawerOpen={this.handleDrawerOpen}
          open={this.state.open}
        />
        <MainMap id="myMap" initMap={initMap} />
      </div>
    );
  }
}
App.propTypes = {};
function mapStateToProps(state) {
  return {
    movie_actions: state.MovieReducer
  };
}
export default connect(
  mapStateToProps,
  {
    fetchMovieAC,
    fetchMovieByRow,
    fetchMovieAll,
    clearMovieHistory
  }
)(App);
