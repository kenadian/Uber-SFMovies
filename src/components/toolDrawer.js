import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Drawer from "@material-ui/core/Drawer";

import { withStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteForever from "@material-ui/icons/DeleteForever";
import ToggleOff from "@material-ui/icons/ToggleOff";
import ToggleOn from "@material-ui/icons/ToggleOn";

const drawerWidth = 240;

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
  }
});
class ToolDrawer extends Component {
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
        {this.props.movieDetails && (
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
          </div>
        )}
        <Divider />

        <List>
          <ListItem button onClick={this.props.clearMarkers}>
            <ListItemIcon>
              <ToggleOff />
            </ListItemIcon>
            <ListItemText primary="Hide Markers" />
          </ListItem>
          <ListItem button onClick={this.props.showMarkers}>
            <ListItemIcon>
              <ToggleOn />
            </ListItemIcon>
            <ListItemText primary="Show Markers" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.props.deleteMarkers}>
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
      </Drawer>
    );
  }
}
ToolDrawer.propTypes = {
  showMarkers: PropTypes.func,
  deleteMarkers: PropTypes.func,
  clearMarkers: PropTypes.func,
  badLocations: PropTypes.array
};
function mapStateToProps(state) {
  return { movieDetails: state.movies.movieDetails };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    null
  )(ToolDrawer)
);
