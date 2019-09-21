import React, { Component } from "react";
import { connect } from "react-redux";
import MovieDetail from "./movieDetail";
import LocationTitle from "./locationTitle";
import LocationDetail from "./locationDetail";
import { Typography } from "@material-ui/core/";

class MovieInfo extends Component {
  render() {
    const {
      classes,
      movieDetails,
      isGettingGooglePlaceResults,
      movieLocations,
      showAllLocations,
      // googlePlaceResults,
      handleLocationClick,
      handleModalOpen
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
              movieLocationsLength={movieLocations.length}
              showAllLocations={showAllLocations}
            />

            {!isGettingGooglePlaceResults &&
              movieLocations &&
              movieLocations.map((loc, index) => {
                return (
                  <LocationDetail
                    key={index}
                    // googlePlaceResults={googlePlaceResults}
                    loc={loc}
                    index={index}
                    classes={classes}
                    handleLocationClick={handleLocationClick}
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
function mapStateToProps(state) {
  return { movieLocations: state.movies.locations };
}
export default connect(
  mapStateToProps,
  null
)(MovieInfo);
