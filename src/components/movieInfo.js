import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MovieDetail from "./movieDetail";
import LocationTitle from "./locationTitle";
import LocationDetail from "./locationDetail";
import { Typography } from "@material-ui/core/";

class MovieInfo extends PureComponent {
  render() {
    const {
      classes,
      movieDetails,
      isGettingGooglePlaceResults,
      locations,
      handleShowAll,
      handleLocationClick,
      handleInfoWindowClick,
      handleModalOpen,
      googlePlaceResults,
      progressCounter,
      locationCount,
      handleCloseAllInfoWindows,
      markers,
      markerWindows
    } = this.props;

    return (
      <React.Fragment>
        {!movieDetails.hasOwnProperty("title") && (
          <Typography className={classes.movieInfo} variant="h6">
            Information about the title will show here. You can search for a
            title or select a saved title.
          </Typography>
        )}
        {movieDetails.hasOwnProperty("title") && (
          <div className={classes.movieInfo}>
            <MovieDetail movieDetails={movieDetails} />

            <LocationTitle
              movieLocationsLength={locationCount}
              handleShowAll={handleShowAll}
              progressCounter={progressCounter}
              handleCloseAllInfoWindows={handleCloseAllInfoWindows}
            />

            {!isGettingGooglePlaceResults &&
              googlePlaceResults.length > 0 &&
              locations &&
              locations.map((loc, index) => {
                const { hasPlace, hasPhoto, photoUrl } = getPlaceAndPhoto(
                  googlePlaceResults,
                  loc
                );

                const hasMarker = markers.includes(loc.id)
                  ? { color: "red", active: true }
                  : { color: "#3f51b5", active: false };

                // test  marker.infoWindowForMarker.anchor to tell if the window has been closed
                const hasMarkerWindow = markerWindows.includes(loc.id)
                  ? { color: "red", active: true }
                  : { color: "#3f51b5", active: false };

                /*
                  TODO 
                  Access the full screen modal display from the marker window by clicking the image.
                 No Image, no click.
                  */
                return (
                  <LocationDetail
                    key={index}
                    googlePlaceResults={googlePlaceResults}
                    loc={loc}
                    index={index}
                    classes={classes}
                    hasPlace={hasPlace}
                    hasPhoto={hasPhoto}
                    photoUrl={photoUrl}
                    hasMarker={hasMarker}
                    hasMarkerWindow={hasMarkerWindow}
                    handleLocationClick={handleLocationClick}
                    handleInfoWindowClick={handleInfoWindowClick}
                    handleModalOpen={handleModalOpen}
                  />
                );
              })}
          </div>
        )}
      </React.Fragment>
    );
  }
}
function getPlaceAndPhoto(googlePlaceResults, loc) {
  const hasPlace = googlePlaceResults.filter(value => {
    return value.id === loc[":id"] && value.places !== null;
  });

  const hasPhoto = googlePlaceResults.filter(value => {
    if (value.places !== null) {
      if (value.places[0].hasOwnProperty("photos")) {
        // Need to check for both properties.
        // Url will be set when data comes from indexeddb
        // getUrl is a function returned from google
        if (
          value.places[0].photos[0].hasOwnProperty("Url") ||
          value.places[0].photos[0].hasOwnProperty("getUrl")
        ) {
          if (value.id === loc[":id"]) {
            return true;
          }
        }
        return false;
      }
      return false;
    }
    return false;
  });

  let photoUrl = null;
  // Need to figure out if the url for the location photo has been built already
  // if it hasn't call the getUrl method, otherwise use the stored Url
  // TODO handle stale photo links
  if (hasPhoto.length > 0) {
    if (hasPhoto[0].places[0].hasOwnProperty("photos")) {
      if (
        hasPhoto[0].places[0].photos[0].hasOwnProperty("Url") ||
        hasPhoto[0].places[0].photos[0].hasOwnProperty("getUrl")
      ) {
        if (hasPhoto[0].places[0].photos[0].hasOwnProperty("Url")) {
          photoUrl = hasPhoto[0].places[0].photos[0].Url;
        }
        if (hasPhoto[0].places[0].photos[0].hasOwnProperty("getUrl")) {
          photoUrl = hasPhoto[0].places[0].photos[0].getUrl();
        }
      }
    }
  }

  return { hasPlace, hasPhoto, photoUrl };
}

MovieInfo.propTypes = {
  isGettingGooglePlaceResults: PropTypes.func,
  handleShowAll: PropTypes.func,
  handleLocationClick: PropTypes.func,
  handleModalOpen: PropTypes.func,
  handleCloseAllInfoWindows: PropTypes.func,

  classes: PropTypes.object,
  movieDetails: PropTypes.object,

  locations: PropTypes.array,
  googlePlaceResults: PropTypes.array,
  markers: PropTypes.array,

  progressCounter: PropTypes.number,
  locationCount: PropTypes.number
};

function mapStateToProps(state) {
  return {
    googlePlaceResults: state.maps.googlePlaceResults,
    locations: state.movies.locations,
    progressCounter: state.location.progressCounter,
    locationCount: state.location.locationCount,
    markers: state.movies.markers,
    markerWindows: state.movies.markerWindows
  };
}
export default connect(
  mapStateToProps,
  null
)(MovieInfo);
