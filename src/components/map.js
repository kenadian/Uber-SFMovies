import React, { Component } from "react";

import { connect } from "react-redux";

class MainMap extends Component {
  componentDidMount() {
    if (!window.google) {
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://maps.googleapis.com/maps/api/js?key=${
        process.env.REACT_APP_MAPS_API_KEY
      }&libraries=places`;
      const x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      s.addEventListener("load", e => {
        this.props.initMap();
      });
    } else {
      this.props.initMap();
    }
  }

  render() {
    return (
      <div style={{ width: "100vw", height: "100vh" }} id={this.props.id} />
    );
  }
}

export default connect()(MainMap);
