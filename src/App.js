import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MainMap from "./components/map.js";
import SearchBar from "./components/searchBar";
import ToolDrawer from "./components/toolDrawer";
import OnboardOverlay from "./components/onboardOverlay";
import { Modal } from "@material-ui/core/";
import store from "./store";
import {
  fetchMovieByTitle,
  clearMovieAC,
  getViewedTitles,
  deleteViewedTitles
} from "./actions/movie_actions";

import {
  initMap,
  clearMarkers,
  showMarkers,
  deleteMarkers,
  clearGooglePlaceResults,
  showAllLocations,
  toggleIsGettingGooglePlaceResults,
  setOnboardingCookie,
  getLocationData,
  createMarker,
  mapPlaces,
  closeInfoWindow,
  openInfoWindow,
  setMapOnOne,
  hasWindow,
  getMarker
} from "./actions/map_actions";

import { getLocDataReqManager, zeroCounters } from "./actions/location_actions";

class App extends Component {
  state = {
    open: false,
    showOverlay: true,
    startSearch: null,
    modalOpen: false,
    errorMessage: ""
  };
  handleShowAll = () => {
    this.props.showAllLocations();
  };
  handleInfoWindowClick = event => {
    const locId = event.currentTarget.getAttribute("data-id");
    const hasWindow = this.props.hasWindow(locId).payload;
    if (hasWindow) {
      this.props.closeInfoWindow(locId);
      return { result: "exists" };
    }
    if (!hasWindow) {
      // if (this.props.getMarker(locId).payload.length > 0) {
      this.props.openInfoWindow(locId);
      // }
      return { result: "new" };
    }

    // getLocationData can return multiple locations as an array
    // Only will return the location that was clicked so I explicitly get that array element [0][0]
    // markerData = {position, imgUrl, funFacts, locName, openWindow}
    // let markerData = this.props.getLocationData(
    //   event.currentTarget.getAttribute("value"),
    //   locId
    // ).payload[0][0];
    // markerData = { ...markerData, openWindow: true, locId };

    // this.props.createMarker(markerData);
    return { result: "added" };
    // this.handleDrawerClose();
  };

  handleLocationClick = event => {
    const active = event.currentTarget.getAttribute("data-active");
    const locId = event.currentTarget.getAttribute("data-id");
    if (active === "true") {
      this.props.setMapOnOne(locId);
      return { result: "exists" };
    }

    // getLocationData can return multiple locations as an array
    // Only will return the location that was clicked so I explicitly get that array element [0][0]
    let markerData = this.props.getLocationData(
      event.currentTarget.getAttribute("value"),
      locId
    ).payload[0][0];
    markerData = { ...markerData, openWindow: true, locId };
    // markerData = {position, imgUrl, funFacts, locName, openWindow}

    this.props.createMarker(markerData);
    return { result: "added" };
    // this.handleDrawerClose();
  };

  componentDidMount() {
    this.props.getViewedTitles();
    this.setState({ open: true });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleModalOpen = event => {
    this.setState({
      modalOpen: true,
      photoUrl: event.currentTarget.attributes.photourl.value
    });
  };

  handleDeleteViewedTitles = title => {
    this.props
      .deleteViewedTitles(title)
      .then(() => store.dispatch(getViewedTitles()));
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleOverlayClose = () => {
    this.props.setOnboardingCookie();
    localStorage.setItem("showSFMOverlay", false);
    this.setState({
      showOverlay: false,
      startSearch: "Invasion of the Body Snatchers"
    });

    //Simulate a movie selection
    //Part of the onboarding process.
    this.handleOnSelect("Invasion of the Body Snatchers");
  };
  handleErrorMessage = errorMessage => this.setState({ errorMessage });

  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      position: "absolute",
      maxWidth: "80%",
      backgroundColor: "white",
      padding: 4,
      outline: "none"
    };
  }

  handleOnSelect = title => {
    const {
      deleteMarkers,
      fetchMovieByTitle,
      getViewedTitles,
      clearGooglePlaceResults,
      zeroCounters
    } = this.props;

    deleteMarkers();
    zeroCounters();
    clearGooglePlaceResults();
    this.props.toggleIsGettingGooglePlaceResults(true);
    this.handleDrawerOpen();

    fetchMovieByTitle(title)
      //returns data from either server or indexDB
      .then(results => {
        if (results.payload.data.length === 0) {
          throw new Error("no data");
        }
        // Build request object used to get data from google maps
        const request = results.payload.data.map(loc => {
          return {
            request: {
              query: `${loc.locations} San Francisco`,
              fields: ["name", "opening_hours", "photos", "geometry"]
            },
            locationDetails: loc
          };
        });

        request.dataSource = results.payload.dataSource;

        if (request.dataSource === "db") {
          // this.props.getLocDataReqManager(request);
          const MAP_GET_LOC_DATA_IN_BG = "MAP_GET_LOC_DATA_IN_BG";
          const requestArray = Object.keys(request);

          requestArray.pop();
          // todo write an action for this
          requestArray.forEach(value => {
            store.dispatch({
              type: MAP_GET_LOC_DATA_IN_BG,
              payload: {
                id: request[value].locationDetails[":id"]
                  ? request[value].locationDetails[":id"]
                  : request[value].locationDetails.id,
                status: "OK",
                places: request[value].locationDetails.places
                  ? [request[value].locationDetails.places]
                  : null,
                funFacts: request[value].locationDetails.fun_facts,
                dataSource: "db"
              }
            });
          });
          // mapPlaces copies the data from an accumulating object to a rendering object
          // to reduce the number of renders as the data is returned from google.
          this.props.mapPlaces();
          return request;
        }

        //todo create an action that moves all of
        if (request.dataSource === "server") {
          this.props.getLocDataReqManager(request);
        }
        return request;
      })

      .then(request => {
        getViewedTitles();
      })
      .catch(err => {
        if (err === "no data") {
          this.handleErrorMessage(
            "Sorry, no location data available for that title."
          );
        }
        console.error(`An error occured when looking up movie info`, err);
      });
  };
  render() {
    const { isGettingGooglePlaceResults } = this.props;

    return (
      <div className="App">
        {this.state.showOverlay &&
          !document.cookie
            .split(";")
            .filter(item => item.includes("showSFMOverlay=false")).length &&
          this.props.getViewedTitles().length > 0 && (
            <OnboardOverlay handleOverlayClose={this.handleOverlayClose} />
          )}
        {/* conditionally show Modal */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={this.handleModalClose}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div style={this.getModalStyle()}>
            <img src={this.state.photoUrl} style={{ maxWidth: 1400 }} alt="" />
          </div>
        </Modal>
        <div>{this.state.errorMessage}</div>
        <SearchBar
          handleDrawerClose={this.handleDrawerClose}
          handleDrawerOpen={this.handleDrawerOpen}
          deleteMarkers={deleteMarkers}
          open={this.state.open}
          startSearch={this.state.startSearch}
          handleOnSelect={this.handleOnSelect}
          isGettingGooglePlaceResults={isGettingGooglePlaceResults}
        />
        <main>
          <ToolDrawer
            open={this.state.open}
            handleDrawerClose={this.handleDrawerClose}
            deleteMarkers={deleteMarkers}
            clearMarkers={clearMarkers}
            showMarkers={showMarkers}
            handleShowAll={this.handleShowAll}
            isGettingGooglePlaceResults={isGettingGooglePlaceResults}
            handleOnSelect={this.handleOnSelect}
            handleModalOpen={this.handleModalOpen}
            handleModalClose={this.handleModalClose}
            handleLocationClick={this.handleLocationClick}
            handleDeleteViewedTitles={this.handleDeleteViewedTitles}
            handleInfoWindowClick={this.handleInfoWindowClick}
          />
          <MainMap id="movieMap" initMap={initMap} />
        </main>
      </div>
    );
  }
}
App.propTypes = {
  setOnboardingCookie: PropTypes.func,
  fetchMovieByTitle: PropTypes.func,
  clearMovieAC: PropTypes.func,
  getViewedTitles: PropTypes.func,
  toggleIsGettingGooglePlaceResults: PropTypes.func,
  getLocDataReqManager: PropTypes.func,
  deleteMarkers: PropTypes.func,
  clearMarkers: PropTypes.func,
  showMarkers: PropTypes.func,
  isGettingGooglePlaceResults: PropTypes.bool,
  showAllLocations: PropTypes.func,
  closeInfoWindow: PropTypes.func,
  openInfoWindow: PropTypes.func,
  setMapOnOne: PropTypes.func,
  hasWindow: PropTypes.func,
  getMarker: PropTypes.func
};

function mapStateToProps(state) {
  return {
    isGettingGooglePlaceResults: state.maps.isGettingGooglePlaceResults
  };
}
export default connect(
  mapStateToProps,
  {
    clearMovieAC,
    initMap,
    clearMarkers,
    showMarkers,
    deleteMarkers,
    fetchMovieByTitle,
    clearGooglePlaceResults,
    toggleIsGettingGooglePlaceResults,
    showAllLocations,
    setOnboardingCookie,
    getViewedTitles,
    getLocDataReqManager,
    createMarker,
    getLocationData,
    mapPlaces,
    zeroCounters,
    deleteViewedTitles,
    closeInfoWindow,
    openInfoWindow,
    setMapOnOne,
    hasWindow,
    getMarker
  }
)(App);
