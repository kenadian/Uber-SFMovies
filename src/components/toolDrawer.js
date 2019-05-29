import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Link,
  Drawer,
  withStyles
} from "@material-ui/core/";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteForever from "@material-ui/icons/DeleteForever";
import ToggleOff from "@material-ui/icons/ToggleOff";
import ToggleOn from "@material-ui/icons/ToggleOn";
import Photo from "@material-ui/icons/Photo";
import Place from "@material-ui/icons/Place";

const drawerWidth = "25%";

const styles = theme => ({
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
  },
  locIcons: {
    fontSize: 22,
    marginBottom: -3,
    marginLeft: 5
  }
  // .loading-shading-mui {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;

  //   background: rgba(255, 255, 255, 0.3);
  // }

  // .loading-icon-mui {
  //   position: absolute;
  //   font-size: 20px;
  //   top: calc(45% - 10px);
  //   left: calc(50% - 10px);
  // }
});

class ToolDrawer extends Component {
  handleLocationClick = event => {
    this.props.getLocationData(
      event.currentTarget.getAttribute("value"),
      event.currentTarget.getAttribute("data-id")
    );
  };
  render() {
    debugger;
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
        {!this.props.movieDetails.hasOwnProperty("title") && (
          <Typography className={classes.movieInfo} variant="h6">
            Information about the title will show here. You can search for a
            title or select a title from the "Previously Viewed" list.
          </Typography>
        )}
        {this.props.movieDetails.hasOwnProperty("title") && (
          <div className={classes.movieInfo}>
            <Typography variant="h5">
              {this.props.movieDetails.title}
            </Typography>
            <Typography variant="body1">
              {this.props.movieDetails.release_year}
            </Typography>
            <Typography variant="h6">Actors</Typography>

            <Typography variant="body1">
              {this.props.movieDetails.actor_1
                ? `${this.props.movieDetails.actor_1}, `
                : ""}
              {this.props.movieDetails.actor_2
                ? `${this.props.movieDetails.actor_2}`
                : ""}
              {this.props.movieDetails.actor_3 ? `, ` : ""}
              {this.props.movieDetails.actor_3
                ? `${this.props.movieDetails.actor_3}`
                : ""}
            </Typography>
            <Typography variant="h6">Writer</Typography>

            <Typography variant="body1">
              {this.props.movieDetails.writer}
            </Typography>
            <Typography variant="h6">Director</Typography>

            <Typography variant="body1">
              {this.props.movieDetails.director}
            </Typography>

            <Typography variant="h6">Production Company</Typography>

            <Typography variant="body1">
              {this.props.movieDetails.production_company}
            </Typography>
            <Typography variant="h6">Distributor</Typography>

            <Typography variant="body1">
              {this.props.movieDetails.distributor}
            </Typography>

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
                ? `${this.props.movieLocations.length} `
                : null}
              Locations{" "}
              {!this.props.isGettingGooglePlaceResults && (
                <Link onClick={this.props.showAllLocations}>Show All</Link>
              )}
            </Typography>

            {!this.props.isGettingGooglePlaceResults &&
              this.props.movieLocations &&
              this.props.movieLocations.map((loc, index, movieLocations) => {
                const hasPlace = this.props.googlePlaceResults.filter(value => {
                  return value.id === loc[":id"];
                });
                const hasPhoto = this.props.googlePlaceResults.filter(value => {
                  if (value.places.length > 0) {
                    if (value.places[0].hasOwnProperty("photos")) {
                      if (value.places[0].photos[0].hasOwnProperty("Url")) {
                        if (value.id === loc[":id"]) {
                          return true;
                        }
                      }
                    }
                  }
                });

                if (hasPlace.length > 0) {
                  return (
                    <Typography key={loc[":id"]} variant="body1">
                      <Link
                        key={loc[":id"]}
                        className={classes.link}
                        onClick={this.handleLocationClick}
                        value={loc.locations}
                        data-id={loc[":id"]}
                      >
                        {loc.locations}
                        <Place className={classes.locIcons} />
                        {hasPhoto.length > 0 ? (
                          <Photo className={classes.locIcons} />
                        ) : null}
                        {/* TODO the photo icon doesn't show on initial load from server. 
                            hasPhoto.length is 0 when component is mounted*/}
                      </Link>
                    </Typography>
                  );
                }
                if (hasPlace.length === 0) {
                  return (
                    <Typography key={loc[":id"]} variant="body1">
                      {loc.locations}
                    </Typography>
                  );
                }
              })}
          </div>
        )}
        <Divider />

        <div className={classes.movieInfo}>
          <Typography variant="h6">Previously Viewed</Typography>
          {this.props.viewedTitles.length > 1 &&
            this.props.viewedTitles.map((value, index) => {
              //TODO add link to load movie details. Which means calling

              return (
                <Typography
                  key={index}
                  datavalue={value}
                  onClick={e => {
                    console.log(e.currentTarget.attributes.datavalue.value);
                    this.props.handleOnSelect(
                      e.currentTarget.attributes.datavalue.value
                    );
                  }}
                >
                  {value}
                </Typography>
              );
            })}
        </div>

        <List>
          <ListItem
            button
            disabled={!this.props.movieDetails}
            onClick={this.props.clearMarkers}
          >
            <ListItemIcon>
              <ToggleOff />
            </ListItemIcon>
            <ListItemText primary="Hide Markers" />
          </ListItem>
          <ListItem
            button
            disabled={!this.props.movieDetails}
            onClick={this.props.showMarkers}
          >
            <ListItemIcon>
              <ToggleOn />
            </ListItemIcon>
            <ListItemText primary="Show Markers" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            disabled={!this.props.movieDetails}
            onClick={this.props.deleteMarkers}
          >
            <ListItemIcon style={{ color: "red" }}>
              <DeleteForever />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error" variant="subtitle1">
                Delete Markers
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
        <Divider />
        <div className={classes.movieInfo}>
          <Typography variant="body1">
            <Link
              color="primary"
              href="https://www.linkedin.com/in/ken-hare"
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
            </Link>
          </Typography>
          <Typography variant="body1">
            <Link
              color="primary"
              href="https://github.com/kenadian/Uber-SFMovies"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </Link>
          </Typography>

          <Typography variant="body1">
            <Link
              color="primary"
              href="http://sfmapproject.s3-website.ca-central-1.amazonaws.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              Ken Hare
            </Link>
          </Typography>
        </div>
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
    movieLocations: state.movies.locations,
    googlePlaceResults: state.maps.googlePlaceResults,
    viewedTitles: state.movies.viewedTitles
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    null
  )(ToolDrawer)
);
