import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  fetchMovieAC,
  fetchMovieByRow,
  fetchMovieAll,
  clearMovieHistory
} from "./actions/movie_actions";

class App extends Component {
  componentDidMount() {
    this.props.fetchMovieAC("Basic");
    this.props.fetchMovieByRow("row-ak55~wgma_df49");
    this.props.fetchMovieAll("release_year", "DESC");
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
App.propTypes = {
  order: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      model: PropTypes.string,
      products_description: PropTypes.string,
      price: PropTypes.number,
      products_cost: PropTypes.number,
      products_quantity: PropTypes.number,
      taxRate: PropTypes.number,
      quantity_to_add: PropTypes.number
    })
  ),
  payment: PropTypes.object
};
function mapStateToProps(state) {
  return {
    movie_actions: state.MovieReducer
  };
}
export default connect(
  mapStateToProps,
  {
    fetchMovieAC,
    fetchMovieByRow,
    fetchMovieAll,
    clearMovieHistory
  }
)(App);
