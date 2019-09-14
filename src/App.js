import React, { Component } from "react";

import { openDB } from "idb/with-async-ittr.js";
// import PropTypes from "prop-types";
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
  savePlacesToLocalStorage,
  showAllLocations,
  toggleIsGettingGooglePlaceResults,
  setOnboardingCookie
} from "./actions/map_actions";

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
      savePlacesToLocalStorage,
      clearMovieAC,

      getLocationDataInBackground,
      clearGooglePlaceResults,
      getViewedTitles
    } = this.props;
    // ;

    deleteMarkers();
    //this is unnescessary with indexdb
    savePlacesToLocalStorage();

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

        request.dataSource = results.payload.data.dataSource;

        return request;
      })

      .then(requestObject => {
        // use this to set a flag that tells getLocationDataInBackground where to get data from
        //requestObject.dataSource==='server'
        //requestObject.dataSource==='db'
        let defaultTimeout = 0;
        clearMovieAC();

        if (requestObject && requestObject.length > 0) {
          this.handleDrawerOpen();
        }

        if (requestObject.dataSource === "server") {
          defaultTimeout = 350;
        }

        let overLimitTimeout = defaultTimeout * 4;

        const getPlaceRecursive = (value, index, timeout) => {
          this.props.toggleIsGettingGooglePlaceResults(true);
          setTimeout(() => {
            getLocationDataInBackground(value).then(response => {
              if (
                response.payload.status &&
                response.payload.status === "OVER_QUERY_LIMIT"
              ) {
                this.props.toggleIsGettingGooglePlaceResults(false);
                getPlaceRecursive(value, index, overLimitTimeout);
              }
              if (response.payload.status && response.payload.status === "OK") {
                if (index === requestObject.length - 1) {
                  //TODO Add additional check to handle queing

                  this.props.toggleIsGettingGooglePlaceResults(false);
                }
              }
              if (
                response.payload.status &&
                response.payload.status === "ZERO_RESULTS"
              ) {
                this.props.toggleIsGettingGooglePlaceResults(false);
              }
            });
          }, timeout);
        };

        clearGooglePlaceResults(); //clear redux state holding results

        requestObject.forEach((value, index) => {
          getPlaceRecursive(value, index, defaultTimeout * index);
        });
      })
      .then(() => getViewedTitles())
      .catch(err =>
        console.error(`An error occured when looking up movie info`, err)
      );
  };
  render() {
    const { deleteMarkers, clearMarkers, showMarkers } = this.props;

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
            <img src={this.state.photoUrl} style={{ maxWidth: 1400 }} />
          </div>
        </Modal>
        <SearchBar
          handleDrawerClose={this.handleDrawerClose}
          handleDrawerOpen={this.handleDrawerOpen}
          deleteMarkers={deleteMarkers}
          open={this.state.open}
          startSearch={this.state.startSearch}
          handleOnSelect={this.handleOnSelect}
          isGettingGooglePlaceResults={this.props.isGettingGooglePlaceResults}
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
            isGettingGooglePlaceResults={this.props.isGettingGooglePlaceResults}
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
App.propTypes = {};
function mapStateToProps(state) {
  return {
    // overLimit: state.maps.googlePlaceResultsOverLimit,
    // isOverLimit: state.maps.overLimit

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
    savePlacesToLocalStorage,
    showAllLocations,
    setOnboardingCookie,
    getViewedTitles
  }
)(App);
