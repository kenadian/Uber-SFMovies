import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Link, Grid } from "@material-ui/core/";
import Photo from "@material-ui/icons/Photo";
import Place from "@material-ui/icons/Place";
//TODO move logic from component to here
// function getPhoto() {
//   return true;
// }

class LocationDetail extends Component {
  render() {
    const {
      googlePlaceResults,
      loc,
      classes,
      index,
      handleLocationClick,
      handleModalOpen
    } = this.props;

    let photoUrl = "";
    const hasPlace = googlePlaceResults.filter(value => {
      return value.id === loc[":id"];
    });

    const hasPhoto = googlePlaceResults.filter(value => {
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
          return false;
        }
        return false;
      }
      return false;
    });

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
    return (
      <React.Fragment>
        {hasPlace.length > 0 && (
          <Grid key={index} container direction="row" justify="space-between">
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
                  onClick={handleLocationClick}
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
                    onClick={handleLocationClick}
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
                      onClick={handleModalOpen}
                      photourl={photoUrl}
                    >
                      <Photo />
                    </Link>
                  ) : (
                    <div style={{ width: 24 }}>
                      <Photo style={{ color: "#e0e0e0" }} />
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {hasPlace.length === 0 && (
          <Grid key={index} container direction="row" justify="space-between">
            <Grid
              item
              style={{
                width: "75%"
              }}
            >
              <Typography
                style={{
                  width: "75%"
                }}
                key={loc[":id"]}
                variant="body1"
              >
                {loc.locations}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item>
                  <Place style={{ color: "#e0e0e0" }} />
                </Grid>

                <Grid style={{ width: 24 }}>
                  {/* <div style={{ width: 24 }}> */}
                  <Photo style={{ color: "#e0e0e0" }} />
                  {/* </div> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    googlePlaceResults: state.maps.googlePlaceResults,
    movieLocations: state.movies.locations
  };
}
export default connect(
  mapStateToProps,
  null
)(LocationDetail);
