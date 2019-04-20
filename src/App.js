import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";

import MainMap from "./components/map.js";
import SearchBar from "./components/searchBar";
import {
  fetchMovieAC,
  fetchMovieByRow,
  fetchMovieAll,
  clearMovieHistory
} from "./actions/movie_actions";
// Generates map code

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map, service, infowindow;
let markers = [];
function createMarker(place) {
  //TODO Add formatted info from movie to info window
  infowindow = new window.google.maps.InfoWindow();
  const marker = new window.google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  window.google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
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
    fields: ["name", "geometry"]
  };

  service = new window.google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function(results, status) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    } else {
      //No Results
      map.setCenter(sanFrancisco);
    }
  });
}
function removeMarker() {
  // marker.setMap(null);
}
function initMap() {
  let sanFrancisco = new window.google.maps.LatLng(37.7749295, -122.4364155);
  map = new window.google.maps.Map(document.getElementById("myMap"), {
    zoom: 13
  });
  map.setCenter(sanFrancisco);
}
class App extends Component {
  constructor(props) {
    super(props);

    // this.initMap = this.initMap.bind(this);
    // this.createMarker = this.createMarker.bind(this);
  }
  componentDidMount() {
    this.props.fetchMovieAC("Basic");
    this.props.fetchMovieByRow("row-ak55~wgma_df49");
    this.props.fetchMovieAll("release_year", "DESC");
  }

  render() {
    return (
      <div className="App">
        <SearchBar
          lookupLocation={lookupLocation}
          deleteMarkers={deleteMarkers}
          clearMarkers={clearMarkers}
          showMarkers={showMarkers}
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
