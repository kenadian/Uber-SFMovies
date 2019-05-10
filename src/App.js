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
  clearMovieHistory,
  fetchByTitle,
  clearMovieAC
} from "./actions/movie_actions";

import {
  initMap,
  setMapOnAll,
  clearMarkers,
  showMarkers,
  deleteMarkers,
  getLocationDataInBackground,
  getLocationData,
  savePlacesToLocalStorage,
  showAllLocations
} from "./actions/map_actions";

class App extends Component {
  state = { open: false, showOverlay: true, startSearch: null };
  onComponentDidMount() {
    this.props.initMap();
  }
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  handleOverlayClose = () => {
    localStorage.setItem("showSFMOverlay", false);
    this.setState({
      showOverlay: false,
      startSearch: "Invasion of the Body Snatchers"
    });
    this.handleOnSelect("Invasion of the Body Snatchers");
  };
  /**
   * @description
   * Called when a movie is selected from the search menu.
   * The result data is used to lookup location data to
   * plot markers on map. Clears the autoLookup query.
   * @param title
   * @memberof SearchBar
   */
  handleOnSelect = title => {
    const {
      deleteMarkers,
      fetchByTitle,
      savePlacesToLocalStorage,
      clearMovieAC,
      mapLocations,
      getLocationDataInBackground
    } = this.props;

    deleteMarkers();

    savePlacesToLocalStorage();

    fetchByTitle(title)
      .then(results => {
        const request = results.payload.data.map(value => {
          return {
            request: {
              query: `${value.locations} San Francisco`,
              fields: ["name", "opening_hours", "photos", "geometry"]
            },
            locationDetails: value
          };
        });

        return request;
      })

      .then(res => {
        clearMovieAC();
        this.handleDrawerOpen();
        return res;
      })
      .then(getLocationDataInBackground)
      .catch(err =>
        console.log(`An error occured when looking up movie info`, err)
      );
  };
  render() {
    const { deleteMarkers, clearMarkers, showMarkers } = this.props;
    return (
      <div className="App">
        {this.state.showOverlay &&
          localStorage.getItem("showSFMOverlay") === null && (
            <OnboardOverlay handleOverlayClose={this.handleOverlayClose} />
          )}

        <SearchBar
          handleDrawerClose={this.handleDrawerClose}
          handleDrawerOpen={this.handleDrawerOpen}
          deleteMarkers={deleteMarkers}
          open={this.state.open}
          startSearch={this.state.startSearch}
          handleOnSelect={this.handleOnSelect}
        />
        <main>
          <ToolDrawer
            open={this.state.open}
            handleDrawerClose={this.handleDrawerClose}
            deleteMarkers={deleteMarkers}
            clearMarkers={clearMarkers}
            showMarkers={showMarkers}
            getLocationData={this.props.getLocationData}
            showAllLocations={this.props.showAllLocations}
          />
          <MainMap id="myMap" initMap={initMap} />
        </main>
      </div>
    );
  }
}
App.propTypes = {};
function mapStateToProps(state) {
  return {
    movie_actions: state.MovieReducer,
    map_actions: state.MapReducer
  };
}
export default connect(
  mapStateToProps,
  {
    fetchMovieAC,
    fetchMovieByRow,
    fetchMovieAll,
    clearMovieHistory,
    clearMovieAC,
    initMap,
    setMapOnAll,
    clearMarkers,
    showMarkers,
    deleteMarkers,
    fetchByTitle,
    getLocationDataInBackground,
    getLocationData,
    savePlacesToLocalStorage,
    showAllLocations
  }
)(App);
