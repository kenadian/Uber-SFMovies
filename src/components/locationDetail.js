import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Typography, Link, Grid } from "@material-ui/core/";
import { PropTypes } from "prop-types";
import Photo from "@material-ui/icons/Photo";
import Place from "@material-ui/icons/Place";
class LocationDetail extends PureComponent {
  render() {
    const {
      loc,
      classes,
      index,
      handleLocationClick,
      handleModalOpen,
      hasPhoto,
      hasPlace,
      photoUrl
    } = this.props;
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
LocationDetail.propTypes = {
  key: PropTypes.number,
  loc: PropTypes.object,
  index: PropTypes.number,
  classes: PropTypes.object,
  hasPlace: PropTypes.array,
  hasPhoto: PropTypes.array,
  photoUrl: PropTypes.string,
  handleLocationClick: PropTypes.func,
  handleModalOpen: PropTypes.func
};

function mapStateToProps(state) {
  return {
    movieLocations: state.movies.locations
  };
}
export default connect(
  mapStateToProps,
  null
)(LocationDetail);
