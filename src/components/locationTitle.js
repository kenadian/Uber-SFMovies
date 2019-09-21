import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CircularProgress, Typography, Link } from "@material-ui/core/";
class LocationTitle extends Component {
  render() {
    return (
      <Typography variant="h6">
        {this.props.isGettingGooglePlaceResults && (
          <CircularProgress
            style={{
              height: 20,
              width: 20,
              float: "left",
              marginRight: 5,
              marginTop: 5
            }}
          />
        )}
        {!this.props.isGettingGooglePlaceResults
          ? `${this.props.movieLocationsLength} `
          : null}
        Locations{" "}
        {!this.props.isGettingGooglePlaceResults && (
          <Link onClick={this.props.showAllLocations}>Show All</Link>
        )}
      </Typography>
    );
  }
}
LocationTitle.propTypes = {
  isGettingGooglePlaceResults: PropTypes.bool,
  showAllLocations: PropTypes.func,
  movieLocationsLength: PropTypes.number
};
function mapStateToProps(state) {
  return {
    isGettingGooglePlaceResults: state.maps.isGettingGooglePlaceResults
  };
}
export default connect(
  mapStateToProps,
  null
)(LocationTitle);
