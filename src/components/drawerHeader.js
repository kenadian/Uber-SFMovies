import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import {
  Typography,
  IconButton,
  withStyles,
  Menu,
  MenuItem,
  Button
} from "@material-ui/core/";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  root: {
    display: "flex",
    color: "green",
    flexDirection: "row"
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
  deleteButton: {
    width: "70"
  }
});

class drawerHead extends PureComponent {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDeletePreviousTitle = event => {
    const title = event.currentTarget.attributes.datavalue.value;
    this.props.handleDeleteViewedTitles(title);
  };

  render() {
    const { anchorEl } = this.state;
    const {
      classes,
      theme,
      handleDrawerClose,
      viewedTitles,
      handleViewedTitlesClick
    } = this.props;
    return (
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
        {viewedTitles.length > 1 && (
          <div className={classes.movieInfo}>
            <Button
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              Previously Viewed ({viewedTitles.length})
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              {viewedTitles.length > 0 &&
                Boolean(anchorEl) &&
                viewedTitles.map((value, index, inputArray) => {
                  //TODO add link to load movie details.

                  return (
                    <MenuItem
                      key={index}
                      onClick={this.handleClose}
                      className={classes.menuItem}
                    >
                      <IconButton
                        datavalue={value.title}
                        className={classes.deleteButton}
                        onClick={this.handleDeletePreviousTitle}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Typography
                        key={index}
                        datavalue={value.title}
                        onClick={handleViewedTitlesClick}
                      >
                        {value.title}
                      </Typography>
                    </MenuItem>
                  );
                })}
            </Menu>
          </div>
        )}
      </div>
    );
  }
}
drawerHead.propTypes = {
  classes: PropTypes.object,
  theme: PropTypes.object,
  handleViewedTitlesClick: PropTypes.func,
  handleDeleteViewedTitles: PropTypes.func,
  handleDrawerClose: PropTypes.func,
  viewedTitles: PropTypes.array
};
export default withStyles(styles, { withTheme: true })(drawerHead);
