import React, { Component } from "react";

import { Typography, Link, withStyles } from "@material-ui/core/";

const styles = {
  root: {
    flexGrow: 1
  },
  movieInfo: {
    padding: "11px 16px 11px 16px"
  }
};

class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
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
    );
  }
}
export default withStyles(styles)(Footer);
