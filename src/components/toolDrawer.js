import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Footer from "./footer";
import MarkerControls from "./markerControls";
import MovieInfo from "./movieInfo";
import DrawerHead from "./drawerHeader";
import {
  Typography,
  Divider,
  IconButton,
  Drawer,
  withStyles
} from "@material-ui/core/";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const drawerWidth = "25%";

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "flex-start",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-start"
  },
  movieInfo: {
    padding: "11px 16px 11px 16px"
  }
});

class ToolDrawer extends PureComponent {
  state = {
    open: false
  };

  handleViewedTitlesClick = event => {
    this.props.handleOnSelect(event.currentTarget.attributes.datavalue.value);
  };
  render() {
    const { classes, theme } = this.props;

    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={this.props.open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <DrawerHead
          handleDrawerClose={this.props.handleDrawerClose}
          viewedTitles={this.props.viewedTitles}
          handleViewedTitlesClick={this.handleViewedTitlesClick}
          handleDeleteViewedTitles={this.props.handleDeleteViewedTitles}
        />
        <Divider />
        <MovieInfo
          movieDetails={this.props.movieDetails}
          handleShowAll={this.props.handleShowAll}
          handleLocationClick={this.props.handleLocationClick}
          handleModalOpen={this.props.handleModalOpen}
          handleCloseAllInfoWindows={this.props.handleCloseAllInfoWindows}
          theme={theme}
          classes={classes}
          googlePlaceResults={this.props.googlePlaceResults}
        />

        <Divider />

        <MarkerControls
          movieDetails={this.props.movieDetails}
          clearMarkers={this.props.clearMarkers}
          showMarkers={this.props.showMarkers}
          deleteMarkers={this.props.deleteMarkers}
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
