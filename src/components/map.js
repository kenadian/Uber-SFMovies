import React, { Component } from "react";
import { withStyles, Typography } from "@material-ui/core/";
const styles = theme => ({
  title: {
    position: "fixed",
    top: 57,
    left: 8,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 10
  },
  //TODO Breakpoints
  [theme.breakpoints.down("xs")]: {
    movieMap: { width: "100vw", height: window.innerHeight - 60 }
  },
  [theme.breakpoints.up("sm")]: {
    movieMap: { width: "100vw", height: "100vh" }
  }
});
class MainMap extends Component {
  componentDidMount() {
    if (!window.google) {
      const mapScript = document.createElement("script");
      mapScript.type = "text/javascript";
      mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}&libraries=places`;
      const scriptElement = document.getElementsByTagName("script")[0];
      scriptElement.parentNode.insertBefore(mapScript, scriptElement);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      mapScript.addEventListener("load", e => {
        this.props.initMap();
      });
    } else {
      this.props.initMap();
    }
  }

  render() {
    const { classes, movieDetails } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h4" className={classes.title}>
          {movieDetails.title}
        </Typography>
        <div className={classes.movieMap} id={this.props.id} />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MainMap);
