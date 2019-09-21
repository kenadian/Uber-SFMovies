import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Footer from "./footer";
import MarkerControls from "./markerControls";
import MovieInfo from "./movieInfo";

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
    alignItems: "center",
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
  handleLocationClick = event => {
    this.props.getLocationData(
      event.currentTarget.getAttribute("value"),
      event.currentTarget.getAttribute("data-id")
    );
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
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.props.handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>

        <Divider />
        <MovieInfo
          movieDetails={this.props.movieDetails}
          // isGettingGooglePlaceResults={this.props.isGettingGooglePlaceResults}
          // movieLocations={this.props.movieLocations}
          showAllLocations={this.props.showAllLocations}
          // googlePlaceResults={this.props.googlePlaceResults}
          handleLocationClick={this.handleLocationClick}
          handleModalOpen={this.props.handleModalOpen}
          theme={theme}
          classes={classes}
        />

        <Divider />
        {this.props.viewedTitles.length > 0 && (
          <div className={classes.movieInfo}>
            <Typography variant="h6">
              Saved Title{this.props.viewedTitles.length > 1 && "s"}
            </Typography>
            {this.props.viewedTitles.length > 0 &&
              this.props.viewedTitles.map((value, index) => {
                //TODO add link to load movie details.

                return (
                  <Typography
                    key={index}
                    datavalue={value}
                    onClick={this.handleViewedTitlesClick}
                  >
                    {value}
                  </Typography>
                );
              })}
          </div>
        )}
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
  clearMarkers: PropTypes.func
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
