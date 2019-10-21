import React, { Component } from "react";
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

class drawerHead extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.setColor = this.setColor.bind(this);
    this.state = {
      anchorEl: null,
      viewedTitleCountColour: "#3f51b5"
    };
  }

  setColor(viewedTitleCountColour) {
    this.setState({ viewedTitleCountColour });
  }
  handleClick(event) {
    const viewedTitlesLength = event.currentTarget.attributes.value.value;

    if (viewedTitlesLength < 1) {
      this.setColor("red");

      setTimeout(() => this.setColor("#3f51b5"), 2000);

      return;
    }
    if (viewedTitlesLength > 0) {
      this.setState({
        anchorEl: event.currentTarget,
        viewedTitleCountColour: "#3f51b5"
      });
    }
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDeletePreviousTitle = event => {
    const title = event.currentTarget.attributes.datavalue.value;
    this.props.handleDeleteViewedTitles(title);
  };

  render() {
    const { anchorEl, viewedTitleCountColour } = this.state;
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

        <div className={classes.movieInfo}>
          <Button
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            value={viewedTitles.length}
            onClick={this.handleClick}
          >
            Previously Viewed
            <span style={{ color: viewedTitleCountColour, marginLeft: 10 }}>
              {`(${viewedTitles.length})`}
            </span>
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
