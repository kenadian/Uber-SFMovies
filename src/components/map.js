import React, { Component } from "react";

import { connect } from "react-redux";

class MainMap extends Component {
  componentDidMount() {
    if (!window.google) {
      const mapScript = document.createElement("script");
      mapScript.type = "text/javascript";
      mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}&libraries=places`;
      const scriptElement = document.getElementsByTagName("script")[0];
      scriptElement.parentNode.insertBefore(mapScript, scriptElement);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      mapScript.addEventListener("load", e => {
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
