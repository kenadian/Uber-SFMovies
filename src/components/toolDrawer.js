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
  withStyles,
  Grid
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
  state = {
    open: false
  };
  handleLocationClick = event => {
    this.props.getLocationData(
      event.currentTarget.getAttribute("value"),
      event.currentTarget.getAttribute("data-id")
    );
  };
  render() {
    const { classes, theme } = this.props;
    let photoUrl = "";
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
            title or select a saved title.
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
                    }
                  }
                });
                if (hasPhoto.length > 0) {
                  if (hasPhoto[0].places[0].hasOwnProperty("photos")) {
                    if (
                      hasPhoto[0].places[0].photos[0].hasOwnProperty("Url") ||
                      hasPhoto[0].places[0].photos[0].hasOwnProperty("getUrl")
                    ) {
                      if (
                        hasPhoto[0].places[0].photos[0].hasOwnProperty("Url")
                      ) {
                        photoUrl = hasPhoto[0].places[0].photos[0].Url;
                      }
                      if (
                        hasPhoto[0].places[0].photos[0].hasOwnProperty("getUrl")
                      ) {
                        photoUrl = hasPhoto[0].places[0].photos[0].getUrl();
                      }
                    }
                  }
                }

                if (hasPlace.length > 0) {
                  return (
                    <Grid
                      key={index}
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid
                        item
                        style={{
                          width: "75%"
                        }}
                      >
                        <Typography key={loc[":id"]} variant="body1">
                          <Link
                            key={loc[":id"]}
                            className={classes.link}
                            onClick={this.handleLocationClick}
                            value={loc.locations}
                            data-id={loc[":id"]}
                          >
                            {loc.locations}
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Link
                              key={loc[":id"]}
                              className={classes.link}
                              onClick={this.handleLocationClick}
                              value={loc.locations}
                              data-id={loc[":id"]}
                            >
                              <Place />
                            </Link>
                          </Grid>

                          <Grid>
                            {hasPhoto.length > 0 ? (
                              <Link
                                target="blank"
                                onClick={this.props.handleModalOpen}
                                photoUrl={photoUrl}
                              >
                                <Photo />
                              </Link>
                            ) : (
                              <div style={{ width: 24 }} />
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                }
                {
                  /* TODO It would be nice to move these to the bottom of the list*/
                }
                if (hasPlace.length === 0) {
                  return (
                    <Typography
                      style={{
                        width: "75%"
                      }}
                      key={loc[":id"]}
                      variant="body1"
                    >
                      {loc.locations}
                    </Typography>
                  );
                }
              })}
          </div>
        )}
        {/* {this.state.noPlace && <div>"Hello"</div>} */}
        <Divider />
        {this.props.viewedTitles.length > 0 && (
          <div className={classes.movieInfo}>
            <Typography variant="h6">
              Saved Title{this.props.viewedTitles.length > 1 && "s"}
            </Typography>
            {this.props.viewedTitles.length > 0 &&
              this.props.viewedTitles.map((value, index) => {
                //TODO add link to load movie details. Which means calling

                return (
                  <Typography
                    key={index}
                    datavalue={value}
                    onClick={e => {
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
        )}
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
