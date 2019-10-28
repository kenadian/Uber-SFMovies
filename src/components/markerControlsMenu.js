import React, { PureComponent } from "react";
import { Grid, Button, withStyles, Typography } from "@material-ui/core/";

import mapMarkerOn from "../images/map-marker-on.png";
import mapMarkerOff from "../images/map-marker-off.png";
import deleteMarkerOn from "../images/delete-marker.png";
import { History } from "@material-ui/icons/";
// TODO Build search functions
const styles = theme => {
  return {
    toolbar: { position: "absolute", bottom: 0, height: 60 },
    tools: { textAlign: "center" }
  };
};

class MarkerControlsMenu extends PureComponent {
  // const { movieDetails, clearMarkers, showMarkers, deleteMarkers } = props;
  constructor(props) {
    super(props);
    this.state = { markerControl: false };
  }
  handleOnShowClick = event => {
    if (!this.state.markerControl) {
      this.props.handleShowAll();
    }
    if (this.state.markerControl) {
      this.props.clearMarkers();
    }
    this.setState({ markerControl: !this.state.markerControl });
  };
  handleOnDeleteClick = event => {
    this.setState({ markerControl: false });
    this.props.deleteMarkers();
  };

  handleOnClickHistory = event => {
    console.log("todo build history");
  };
  render() {
    const { movieDetails, classes, zoomToSF } = this.props;

    return (
      <Grid container className={classes.toolbar}>
        <Grid item xs={3} className={classes.tools}>
          <Grid item xs={12}>
            <Button disabled={!movieDetails} onClick={this.handleOnShowClick}>
              {this.state.markerControl && (
                <img src={mapMarkerOn} alt="Marker On" />
              )}
              {!this.state.markerControl && (
                <img src={mapMarkerOff} alt="Marker Off" />
              )}
            </Button>
          </Grid>
          <Typography variant="caption">Show</Typography>
          {/* <Grid item>Show</Grid> */}
        </Grid>

        <Grid item xs={3} className={classes.tools}>
          <Grid item xs={12}>
            <Button disabled={!movieDetails} onClick={this.handleOnDeleteClick}>
              <img src={deleteMarkerOn} alt="Delete All Markers" />
            </Button>
          </Grid>
          <Typography variant="caption">Delete</Typography>
        </Grid>

        <Grid item xs={3} className={classes.tools}>
          <Grid item xs={12}>
            <Button onClick={this.handleOnClickHistory}>
              <History />
            </Button>
          </Grid>
          <Typography variant="caption">Viewed</Typography>
        </Grid>

        <Grid item xs={3} className={classes.tools}>
          <Grid item xs={12}>
            <Button onClick={zoomToSF}>0</Button>
          </Grid>
          <Typography variant="caption">zoom</Typography>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(MarkerControlsMenu);
