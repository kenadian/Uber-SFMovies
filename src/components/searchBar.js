import React, { Component } from "react";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  handleOnClick = () => {
    this.props.lookupLocation(document.getElementById("term").value);
    this.setState({ value: document.getElementById("term").value });
  };

  render() {
    return (
      <div style={{ height: 100 }}>
        <input type="text" id="term" />
        <button onClick={this.handleOnClick}>Make Marker</button>
        <button onClick={this.props.deleteMarkers}>Delete Markers</button>
        <button onClick={this.props.clearMarkers}>Hide Markers</button>
        <button onClick={this.props.showMarkers}>Show Markers</button>
      </div>
    );
  }
}

export default SearchBar;
