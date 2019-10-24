import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Footer from "./footer";
import MarkerControls from "./markerControls";
import MovieInfo from "./movieInfo";
import DrawerHead from "./drawerHeader";
import { Divider, Drawer, withStyles } from "@material-ui/core/";

const styles = theme => {
  // theme.breakpoints.values.xs = 376;
  // theme.breakpoints.values.sm = 412;
  return {
    drawer: {
      [theme.breakpoints.down("sm")]: {
        width: "100%"
      },
      [theme.breakpoints.up("sm")]: {
        width: "25%"
      },
      flexShrink: 0
    },
    drawerPaper: {
      [theme.breakpoints.down("sm")]: {
        width: window.innerWidth - 1
      },
      [theme.breakpoints.up("sm")]: {
        width: "25%"
      },
      [theme.breakpoints.down("sm")]: {
        backgroundColor: "rgba(255, 255, 255, 0.93)",
        height: window.innerHeight - 61
      }
    },

    movieInfo: {
      [theme.breakpoints.down("sm")]: {
        margin: "11px 20px 11px 20px",
        padding: 0
      },
      padding: "11px 36px 11px 16px"
    },
    markerControls: {
      [theme.breakpoints.down("sm")]: {
        display: "none"
      }
    },
    showAll: {
      [theme.breakpoints.down("sm")]: {
        display: "none"
      }
    }
  };
};

class ToolDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
    this.handleOnClickDetails = this.handleOnClickDetails.bind(this);
  }
  /**
   * toggles production info on and off in MovieDetails
   *
   * @memberof ToolDrawer
   */
  handleOnClickDetails() {
    this.setState({ showDetails: !this.state.showDetails });
  }
  handleViewedTitlesClick = event => {
    this.props.handleOnSelect(event.currentTarget.attributes.datavalue.value);
  };
  render() {
    const {
      classes,
      theme,
      drawerOpen,
      handleDrawerClose,
      viewedTitles,
      handleDeleteViewedTitles,
      movieDetails,
      handleShowAll,
      handleLocationClick,
      handleModalOpen,
      handleCloseAllInfoWindows,
      handleInfoWindowClick,
      googlePlaceResults,
      clearMarkers,
      showMarkers,
      deleteMarkers
    } = this.props;
    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <DrawerHead
          handleDrawerClose={handleDrawerClose}
          viewedTitles={viewedTitles}
          handleViewedTitlesClick={this.handleViewedTitlesClick}
          handleDeleteViewedTitles={handleDeleteViewedTitles}
        />
        <Divider />
        <MovieInfo
          movieDetails={movieDetails}
          handleShowAll={handleShowAll}
          handleLocationClick={handleLocationClick}
          handleModalOpen={handleModalOpen}
          handleCloseAllInfoWindows={handleCloseAllInfoWindows}
          handleInfoWindowClick={handleInfoWindowClick}
          handleOnClickDetails={this.handleOnClickDetails}
          showDetails={this.state.showDetails}
          theme={theme}
          classes={classes}
          googlePlaceResults={googlePlaceResults}
        />

        <Divider />

        <MarkerControls
          classes={classes}
          movieDetails={movieDetails}
          clearMarkers={clearMarkers}
          showMarkers={showMarkers}
          deleteMarkers={deleteMarkers}
        />
        <Divider />
        <Footer />
      </Drawer>
    );
  }
}

ToolDrawer.propTypes = {
  showMarkers: PropTypes.func,
  deleteMarkers: PropTypes.func,
  plotAllMarkers: PropTypes.func,
  clearMarkers: PropTypes.func,
  getLocationData: PropTypes.func,
  handleLocationClick: PropTypes.func
};
function mapStateToProps(state) {
  return {
    movieDetails: state.movies.movieDetails,
    viewedTitles: state.movies.viewedTitles,
    isGettingGooglePlaceResults: state.maps.isGettingGooglePlaceResults
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    null
  )(ToolDrawer)
);
