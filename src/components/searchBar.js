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
  ListItemText
} from "@material-ui/core";

import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

import {
  fetchMovieAC,
  fetchByTitle,
  clearMovieAC
} from "../actions/movie_actions";

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  title: {
    paddingLeft: 50
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
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
    }
  },
  item: {},
  itemHighlight: { backgroundColor: "rgba(63, 81, 181, 0.31)" },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
    fontSize: 24,
    flexGrow: 1
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
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
    const { classes } = this.props;
    const searchResults = this.props.movieSearchResults;
    const { open } = this.props.open;

    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar disableGutters={!open}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            SF Movies
          </Typography>
          <div className={classes.search}>
            {!this.props.isGettingGooglePlaceResults && (
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
            )}
            {this.props.isGettingGooglePlaceResults && (
              <div className={classes.searchIcon}>
                <CircularProgress style={{ height: 20, width: 20 }} />
              </div>
            )}

            <Autocomplete
              renderInput={props => {
                return (
                  <InputBase
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={props}
                    disabled={this.props.isGettingGooglePlaceResults}
                  />
                );
              }}
              inputProps={{
                id: "term",
                placeholder: "Film Title (min 3 letters)",
                // className: classes.uiWidget,
                style: { height: 40, fontSize: 22, width: 400, marginLeft: 25 },
                autoFocus: true
              }}
              getItemValue={item => {
                return String(item.term);
              }}
              items={searchResults ? searchResults : []}
              value={this.state.value}
              onChange={(event, value) => {
                this.setState({ value: value });

                if (event.target.value.length === 0) {
                  this.props.handleDrawerClose();
                }
                if (event.target.value.length >= 3) {
                  this.props
                    .fetchMovieAC(value)
                    .catch(err =>
                      console.error(`Can't get value for AutoComplete${err}`)
                    );
                }
              }}
              onSelect={(value, item) => {
                this.setState({
                  value: item.title,
                  isFetching: true
                });
                this.props.handleOnSelect(item.title);

                //
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
          </div>
          <div className={classes.grow} />
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.props.handleDrawerOpen}
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
  fetchByTitle: PropTypes.func,
  clearMovieAC: PropTypes.func,
  lookupLocation: PropTypes.func,
  createMarkers: PropTypes.func,
  movieSearchResults: PropTypes.array,
  movieLocationResults: PropTypes.array,
  open: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    movieSearchResults: state.movies.searchResults,
    movieLocationResults: state.maps.movieLocationData
    // isGettingGooglePlaceResults: state.maps.isGettingGooglePlaceResults
    // googlePlaceResultsOverLimit: state.maps.googlePlaceResultsOverLimit
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    {
      fetchMovieAC,
      fetchByTitle,
      clearMovieAC
    }
  )(SearchBar)
);
