import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CircularProgress, Typography, Link } from "@material-ui/core/";
class LocationTitle extends Component {
  render() {
    return (
      <Typography variant="h6">
        {this.props.isGettingGooglePlaceResults && (
          <div>
            <CircularProgress
              style={{
                height: 20,
                width: 20,
                float: "left",
                marginRight: 5,
                marginTop: 5
              }}
            />
            {"  "}
            {this.props.progressCounter} of {this.props.movieLocationsLength}
          </div>
        )}

        {!this.props.isGettingGooglePlaceResults
          ? `${this.props.movieLocationsLength} Locations   ` //extra space is necessary
          : null}
        {/* TODO the showall button should be disabled if their is no location data to show */}
        {!this.props.isGettingGooglePlaceResults && (
          <Link onClick={this.props.handleShowAll}>Show All</Link>
        )}
      </Typography>
    );
  }
}
LocationTitle.propTypes = {
  isGettingGooglePlaceResults: PropTypes.bool,
  movieLocationsLength: PropTypes.number,
  progressCounter: PropTypes.number,
  handleShowAll: PropTypes.func
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
