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
// Generates map code

let map, service, infowindow;
let markers = [];

function createMarker(place) {
  const imgUrl =
    "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sCmRaAAAAGLmfv3mdiIOkFdvOOkLVe3swjgpbCttDmSvt6RpbR31adEEf6kU-_-6yI8gfBUZohnfxsFu9pHDqS0MTkENkrbH-2bcAdCVdhfbh2XXTRvBdZN2RXXbr6xvA1aGl8sWwEhDG0UasCfZEtNpnjZ_iEnDcGhRaoU5RNKyF6Q8WXpyrRo0HpfEYng&3u4160&5m1&2e1&callback=none&key=AIzaSyAzTlRobTToKxBdlWn6XHwXKliycq0uZis&token=90971";
  const placeholder = `<div style=' maxwidth: 200px' >
      <div>
        <img src=${imgUrl} height="100px" />
      </div>
      <div>${place.name}</div>
      <div>
        The Mandarin Theatre was renamed the Sun Sing Theatre in 1949. It closed
        1986.
      </div>
    </div>`;

  //TODO Add formatted fun facts from location to info window
  infowindow = new window.google.maps.InfoWindow();
  const marker = new window.google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  window.google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(placeholder);
    infowindow.open(map, marker);
  });
  markers.push(marker);
}
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

function lookupLocation(movieLocation) {
  let sanFrancisco = new window.google.maps.LatLng(37.7749295, -122.4364155);
  const request = {
    query: `${movieLocation} San Francisco`,
    fields: ["name", "opening_hours", "photos", "geometry"]
  };

  service = new window.google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        console.log(
          results[0].hasOwnProperty("photos")
            ? results[0].photos[0].getUrl()
            : "No Photo"
        );

        createMarker(results[i]);
      }
    } else {
      console.log("bad Location", request.query);
      // TODO Handle bad addresses
      // Save bad address for later use
      // Write regexp to get string inside parentheses
      // call findPlaceFromQuery using this string
      // If it fails again use saved address in movie details
      // to show why.

      //No Results
      map.setCenter(sanFrancisco);
    }
  });
}
// function removeMarker() {
//   // marker.setMap(null);
// }
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
          lookupLocation={lookupLocation}
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
