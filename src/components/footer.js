import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
const styles = theme => {
  console.log(theme);
  return {
    root: {
      flexGrow: 1
    },

    link: {
      margin: theme.spacing.unit
    },
    footerItem: {
      //   padding: theme.spacing.unit * 2,
      textAlign: "center",
      color: theme.palette.text.secondary,
      padding: "5px 0 5px 0"
    },
    footerContainer: {
      height: 100,
      backgroundColor: theme.palette.background.default
    }
  };
};

class Footer extends Component {
  render(props) {
    const { classes } = this.props;
    return (
      <footer id="footer">
        <section className={classes.root}>
          <Grid
            className={classes.footerContainer}
            container
            spacing={24}
            alignItems="center"
            justify="center"
          >
            <Grid className={classes.footerItem} item xs={2}>
              <Link
                color="primary"
                href="https://www.linkedin.com/in/ken-hare"
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn
              </Link>
            </Grid>
            <Grid className={classes.footerItem} item xs={2}>
              <Link
                color="primary"
                href="https://github.com/kenadian/Uber-SFMovies"
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub
              </Link>
            </Grid>

            <Grid className={classes.footerItem} item xs={2}>
              <Link
                color="primary"
                href="http://sfmapproject.s3-website.ca-central-1.amazonaws.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Ken Hare
              </Link>
            </Grid>
          </Grid>
        </section>
      </footer>
    );
  }
}
export default withStyles(styles)(Footer);
