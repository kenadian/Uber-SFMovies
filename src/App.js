import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MainMap from "./components/map.js";
import SearchBar from "./components/searchBar";
import ToolDrawer from "./components/toolDrawer";
import OnboardOverlay from "./components/onboardOverlay";
import { Modal } from "@material-ui/core/";
import {
  fetchMovieAC,
  fetchMovieByRow,
  fetchMovieAll,
  clearMovieHistory,
  fetchByTitle,
  clearMovieAC,
  getViewedTitles
} from "./actions/movie_actions";

import {
  initMap,
  setMapOnAll,
  clearMarkers,
  showMarkers,
  deleteMarkers,
  getLocationDataInBackground,
  clearGooglePlaceResults,
  getLocationData,
  showAllLocations,
  toggleIsGettingGooglePlaceResults,
  setOnboardingCookie
} from "./actions/map_actions";

import { getLocDataReqManager } from "./actions/location_actions";

class App extends Component {
  state = {
    open: false,
    showOverlay: true,
    startSearch: null,
    modalOpen: false
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
      fetchByTitle,
      clearMovieAC,
      getViewedTitles
    } = this.props;

    fetchByTitle(title)
      //returns data from either server or indexDB
      .then(results => {
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
        return request;
      })
      .then(request => {
        this.props.toggleIsGettingGooglePlaceResults(true);
        return request;
      })
      .then(requestObject => {
        clearMovieAC();

        if (requestObject && requestObject.length > 0) {
          this.handleDrawerOpen();
        }
        this.props.getLocDataReqManager(requestObject);
      })
      .then(() => {
        getViewedTitles();
      })
      .catch(err =>
        console.error(`An error occured when looking up movie info`, err)
      )
      .finally(() => {
        deleteMarkers();
      });
  };
  render() {
    const {
      deleteMarkers,
      clearMarkers,
      showMarkers,
      isGettingGooglePlaceResults,
      getLocationData,
      showAllLocations
    } = this.props;

    return (
      <div className="App">
        {this.state.showOverlay &&
          !document.cookie
            .split(";")
            .filter(item => item.includes("showSFMOverlay=false")).length && (
            <OnboardOverlay handleOverlayClose={this.handleOverlayClose} />
          )}
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
            getLocationData={getLocationData}
            showAllLocations={showAllLocations}
            isGettingGooglePlaceResults={isGettingGooglePlaceResults}
            handleOnSelect={this.handleOnSelect}
            handleModalOpen={this.handleModalOpen}
            handleModalClose={this.handleModalClose}
          />
          <MainMap id="myMap" initMap={initMap} />
        </main>
      </div>
    );
  }
}
App.propTypes = {
  setOnboardingCookie: PropTypes.func,
  fetchByTitle: PropTypes.func,
  clearMovieAC: PropTypes.func,
  getViewedTitles: PropTypes.func,
  toggleIsGettingGooglePlaceResults: PropTypes.func,
  getLocDataReqManager: PropTypes.func,
  deleteMarkers: PropTypes.func,
  clearMarkers: PropTypes.func,
  showMarkers: PropTypes.func,
  isGettingGooglePlaceResults: PropTypes.bool,
  getLocationData: PropTypes.func,
  showAllLocations: PropTypes.func
};

function mapStateToProps(state) {
  return {
    isGettingGooglePlaceResults: state.maps.isGettingGooglePlaceResults
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
    clearGooglePlaceResults,
    toggleIsGettingGooglePlaceResults,
    getLocationData,
    showAllLocations,
    setOnboardingCookie,
    getViewedTitles,
    getLocDataReqManager
  }
)(App);
