import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => {
  console.log(theme);
  return {
    root: {
      flexGrow: 1,
      backgroundColor: "rgba(0, 2, 27, 0.55)",
      backgroundImage: `url("images/splash.jpg")`,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "scroll",
      backgroundPosition: "50% 50%",
      width: "100vw",
      height: "100vh",
      padding: "20%",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 100
    },

    box: {
      backgroundColor: "white",
      padding: 25,
      width: "50%"
    }
  };
};

class OnboardOverlay extends Component {
  render(props) {
    const { classes } = this.props;
    return (
      <Grid
        className={classes.root}
        container
        justify="center"
        alignItems="center"
      >
        <Grid className={classes.box} item xs={12} md={6}>
          <Typography paragraph variant="body1">
            If you love movies, and you love San Francisco, you're bound to love
            this -- a listing of filming locations of movies shot in San
            Francisco starting from 1924. You'll find the titles, locations, fun
            facts, names of the director, writer, actors, and studio for most of
            these films. .
          </Typography>
          <Typography paragraph variant="body1">
            To get started try a search for "Invasion of the Body Snatchers".
          </Typography>
          <Button fullWidth onClick={this.props.handleOverlayClose}>
            Get Started
          </Button>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(OnboardOverlay);
