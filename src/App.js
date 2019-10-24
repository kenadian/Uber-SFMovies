import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MainMap from "./components/map.js";
import SearchBar from "./components/searchBar";
import MarkerControlsMenu from "./components/markerControlsMenu";
import ToolDrawer from "./components/toolDrawer";
import OnboardOverlay from "./components/onboardOverlay";
import { Modal } from "@material-ui/core/";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";

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
  getMarker,
  zoomToSF
} from "./actions/map_actions";
import { getLocDataReqManager, zeroCounters } from "./actions/location_actions";

let theme = createMuiTheme();
theme = {
  ...theme,
  breakpoints: {
    ...theme.breakpoints,
    values: { ...theme.breakpoints.values, xs: 376, sm: 376 }
  }
};
const styles = theme => {
  return {
    root: "initial"
  };
};

class App extends Component {
  state = {
    //TODO give state.open a new name
    open: false,
    drawerOpen: false,
    showOverlay:
      document.cookie
        .split(";")
        .filter(item => item.includes("showSFMOverlay=false")).length > 0
        ? false
        : true,
    modalOpen: false,
    errorMessage: ""
  };

  componentDidMount() {
    this.props.getViewedTitles();
  }
  handleShowAll = () => {
    this.props.showAllLocations();
  };
  handleInfoWindowClick = event => {
    const locId = event.currentTarget.getAttribute("data-id");
    const hasWindow = this.props.hasWindow(locId).payload;
    if (hasWindow) {
      this.props.closeInfoWindow(locId);
      this.handleDrawerClose();
      return { result: "exists" };
    }
    if (!hasWindow) {
      this.props.openInfoWindow(locId);
      this.handleDrawerClose();
      return { result: "new" };
    }

    return { result: "added" };
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
    //NOTE markerData = {position, imgUrl, funFacts, locName, openWindow}

    this.props.createMarker(markerData);
    this.handleDrawerClose();
    return { result: "added" };
  };

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    if (window.innerWidth < 412) {
      this.setState({ drawerOpen: false });
    }
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

  handleOverlayClose = event => {
    let forever = null;
    if (event.currentTarget.attributes.hasOwnProperty("forever")) {
      forever = event.currentTarget.attributes["forever"].value;
    }
    this.props.setOnboardingCookie(forever);
    localStorage.setItem("showSFMOverlay", false);
    this.setState({
      showOverlay: false
    });

    //Simulate a movie selection
    //Part of the onboarding process.
    if (forever === null) {
      this.handleOnSelect("Invasion of the Body Snatchers");
    }
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
          const MAP_GET_LOC_DATA_IN_BG = "MAP_GET_LOC_DATA_IN_BG";
          const requestArray = Object.keys(request);

          requestArray.pop();
          // TODO write an action for this
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
  getWidth = () => {
    return window.innerWidth;
  };

  render() {
    const { isGettingGooglePlaceResults, movieDetails, zoomToSF } = this.props;
    const { drawerOpen } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          {this.state.showOverlay && (
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
              <img
                src={this.state.photoUrl}
                style={{ maxWidth: 1400 }}
                alt="San Francisco and Golden Gate bridge"
              />
            </div>
          </Modal>
          <div>{this.state.errorMessage}</div>
          {!this.state.showOverlay && (
            <SearchBar
              handleDrawerClose={this.handleDrawerClose}
              handleDrawerOpen={this.handleDrawerOpen}
              deleteMarkers={deleteMarkers}
              open={this.state.open}
              drawerOpen={drawerOpen}
              handleOnSelect={this.handleOnSelect}
              isGettingGooglePlaceResults={isGettingGooglePlaceResults}
            />
          )}
          {this.getWidth() < 420 && (
            <MarkerControlsMenu
              zoomToSF={zoomToSF}
              movieDetails={movieDetails}
              clearMarkers={this.props.clearMarkers}
              showMarkers={this.props.showMarkers}
              deleteMarkers={this.props.deleteMarkers}
              handleShowAll={this.handleShowAll}
              handleDrawerClose={this.handleDrawerClose}
              handleDrawerOpen={this.handleDrawerOpen}
              open={this.state.open}
              drawerOpen={drawerOpen}
              handleOnSelect={this.handleOnSelect}
              isGettingGooglePlaceResults={isGettingGooglePlaceResults}
            />
          )}
          {/* {this.getWidth() > 419 && ( */}
          <main>
            <ToolDrawer
              open={this.state.open}
              drawerOpen={drawerOpen}
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
          </main>
          {/* )} */}
          <MainMap
            id="movieMap"
            initMap={initMap}
            movieDetails={movieDetails}
          />
        </div>
      </MuiThemeProvider>
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
  getMarker: PropTypes.func,
  zoomToSF: PropTypes.func
};

function mapStateToProps(state) {
  return {
    isGettingGooglePlaceResults: state.maps.isGettingGooglePlaceResults,
    movieDetails: state.movies.movieDetails
  };
}
export default withStyles(styles)(
  connect(
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
      getMarker,
      zoomToSF
    }
  )(App)
);
