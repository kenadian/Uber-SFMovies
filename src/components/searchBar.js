import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Autocomplete from "react-autocomplete";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  AppBar,
  InputBase,
  Toolbar,
  IconButton,
  List,
  ListItem,
  Typography,
  ListItemText,
  Grid
} from "@material-ui/core";

import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

import {
  fetchMovieAC,
  fetchMovieByTitle,
  clearMovieAC
} from "../actions/movie_actions";

const styles = theme => ({
  appBar: {
    // [theme.breakpoints.down("sm")]: {
    //   display: "none"
    // }
  },
  grow: {
    flexGrow: 1
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    paddingLeft: 50
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      marginRight: 4
    }
  },
  hide: {
    display: "none"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    },
    [theme.breakpoints.down("sm")]: {
      width: "unset"
    }
  },
  item: {},
  itemHighlight: { backgroundColor: "rgba(63, 81, 181, 0.31)" },
  searchIcon: {
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing.unit * 8
    },
    width: theme.spacing.unit * 5,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  inputRoot: {
    [theme.breakpoints.down("sm")]: {
      width: "unset"
    },

    color: "inherit",
    width: "100%",
    fontSize: 24,
    flexGrow: 1
  },
  inputInput: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginLeft: 55,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    transition: theme.transitions.create("width"),
    // width: "100%",
    height: 54,
    fontSize: 22,
    width: 550,
    [theme.breakpoints.down("sm")]: {
      width: 291,
      fontSize: 18
    }
  },
  displayTitle: {
    display: "flex",
    alignItems: "center",
    height: 54,
    color: "white",
    fontSize: 22,
    width: 550,
    marginLeft: 55,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
      width: 291,
      overflow: "scroll",
      whiteSpace: "nowrap"
    }
  },
  input: {
    fontSize: 48
  },
  searchListOff: { display: "none" },
  searchListOn: {
    position: "absolute",
    paddingLeft: 35,
    backgroundColor: "white",
    maxHeight: "50vh",
    overflow: "scroll",
    zIndex: 100
  }
});

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      markerData: [],
      isFetching: false
    };
  }

  render() {
    const {
      classes,
      open,
      drawerOpen,
      isGettingGooglePlaceResults,
      handleDrawerClose,
      fetchMovieAC,
      handleOnSelect,
      handleDrawerOpen,
      movieDetails,
      movieSearchResults,
      hideTitle,
      handleOnFocusSearch,
      handleOnBlurSearch
    } = this.props;
    const searchResults = movieSearchResults;

    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        {/* <Toolbar disableGutters={!open}> */}
        <Toolbar disableGutters={!open}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            SF Movies
          </Typography>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.search}
          >
            {!isGettingGooglePlaceResults && (
              <Grid item className={classes.searchIcon}>
                <SearchIcon />
              </Grid>
            )}
            {isGettingGooglePlaceResults && (
              <Grid item className={classes.searchIcon}>
                <CircularProgress style={{ height: 20, width: 20 }} />
              </Grid>
            )}
            {hideTitle && (
              <Grid item>
                <Autocomplete
                  renderInput={props => {
                    return (
                      <InputBase
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput
                        }}
                        inputProps={props}
                        disabled={isGettingGooglePlaceResults}
                      />
                    );
                  }}
                  inputProps={{
                    id: "term",
                    placeholder: "Film Title (min 3 letters)",
                    autoFocus: true,
                    onBlur: function(event) {
                      handleOnBlurSearch();
                    }
                  }}
                  getItemValue={item => {
                    return String(item.term);
                  }}
                  items={searchResults ? searchResults : []}
                  value={this.state.value}
                  onChange={(event, value) => {
                    this.setState({ value: value });
                    if (event.target.value.length === 0) {
                      handleDrawerClose();
                    }
                    if (event.target.value.length >= 3) {
                      fetchMovieAC(value).catch(err =>
                        console.error(`Can't get value for AutoComplete${err}`)
                      );
                    }
                  }}
                  onSelect={(value, item) => {
                    this.setState({
                      value: "",
                      isFetching: true
                    });
                    handleOnSelect(item.title);
                  }}
                  renderMenu={children => {
                    return (
                      <List
                        id="movieSearch"
                        className={
                          children.length === 0
                            ? classes.searchListOff
                            : classes.searchListOn
                        }
                      >
                        {children}
                      </List>
                    );
                  }}
                  renderItem={(item, isHighlighted) => {
                    return (
                      <ListItem
                        className={
                          isHighlighted ? classes.itemHighlight : classes.item
                        }
                        key={item.title}
                      >
                        <ListItemText
                          style={{
                            height: 25,
                            minWidth: 200,
                            paddingRight: 25,
                            color: "black"
                          }}
                        >
                          {item.title}{" "}
                        </ListItemText>
                      </ListItem>
                    );
                  }}
                  autoHighlight={true}
                  type="text"
                />
              </Grid>
            )}
            {!hideTitle && (
              <Grid item onClick={handleOnFocusSearch}>
                <Typography
                  // className={classes.inputInput}
                  className={classes.displayTitle}
                  style={{ color: "white" }}
                >
                  {movieDetails.title}
                </Typography>
              </Grid>
            )}
          </Grid>
          <div className={classes.grow} />
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

SearchBar.propTypes = {
  handleDrawerOpen: PropTypes.func,
  fetchMovieAC: PropTypes.func,
  fetchMovieByTitle: PropTypes.func,
  clearMovieAC: PropTypes.func,
  lookupLocation: PropTypes.func,
  createMarkers: PropTypes.func,
  movieSearchResults: PropTypes.array,
  open: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    movieSearchResults: state.movies.searchResults
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    {
      fetchMovieAC,
      fetchMovieByTitle,
      clearMovieAC
    }
  )(SearchBar)
);
