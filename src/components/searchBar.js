import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Autocomplete from "react-autocomplete";
import AppBar from "@material-ui/core/AppBar";
import InputBase from "@material-ui/core/InputBase";
import Input from "@material-ui/core/Input";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { fade } from "@material-ui/core/styles/colorManipulator";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import classNames from "classnames";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import {
  fetchMovieAC,
  fetchByTitle,
  clearMovieAC
} from "../actions/movie_actions";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
const drawerWidth = 240;
//TODO position the hamburger on the right using flex
const styles = theme => ({
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
    fontSize: 24
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
    // width: 600,
    // left: 400,
    paddingLeft: 35,
    backgroundColor: "white",
    zIndex: 100
  }
});
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", markerData: [] };
  }

  //   handleOnClick = () => {
  //     this.props.lookupLocation(document.getElementById("term").value);
  //     this.setState({ value: document.getElementById("term").value });
  //   };

  handleOnSelect = title => {
    this.props.deleteMarkers();
    this.props
      .fetchByTitle(title)
      .then(results => {
        console.log(results);
        results.payload.data.forEach(element => {
          this.props.lookupLocation(element.locations);
        });
      })
      .then(this.props.clearMovieAC);
  };

  render() {
    const { classes, theme } = this.props;
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
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <Autocomplete
              renderInput={props => {
                return (
                  <InputBase
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={props}
                  />
                );
              }}
              inputProps={{
                id: "term",
                placeholder: "Film Title (min 3 letters)",
                // className: classes.uiWidget,
                style: { height: 40, fontSize: 12, width: 300, marginLeft: 25 },
                autoFocus: true
              }}
              getItemValue={item => {
                return String(item.term);
              }}
              items={searchResults ? searchResults : []}
              value={this.state.value}
              onChange={(event, value) => {
                this.setState({ value: value });
                if (event.target.value.length >= 3) {
                  this.props.fetchMovieAC(value);
                }
              }}
              onSelect={(value, item) => {
                this.setState({
                  value: item.title
                });
                this.handleOnSelect(item.title);

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
                    // style={{
                    //   position: "absolute",
                    //   // width: 600,
                    //   // left: 400,
                    //   paddingLeft: 35,
                    //   backgroundColor: "white",
                    //   zIndex: 100
                    // }}
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
  fetchMovieAC: PropTypes.func,
  fetchByTitle: PropTypes.func,
  clearMovieAC: PropTypes.func,
  lookupLocation: PropTypes.func,
  movieSearchResults: PropTypes.array
};

function mapStateToProps(state) {
  return { movieSearchResults: state.movies.searchResults };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    { fetchMovieAC, fetchByTitle, clearMovieAC }
  )(SearchBar)
);
// export default withStyles(styles, { withTheme: true })(ToolDrawer);
