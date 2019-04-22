import React, { Component } from "react";

class OnboardOverlay extends Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "rgba(0, 2, 27, 0.55)",
          width: "100vw",
          height: "100vh",
          padding: "20%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 100
        }}
      >
        <div style={{ backgroundColor: "white", padding: 25, width: "50%" }}>
          <p>
            If you love movies, and you love San Francisco, you're bound to love
            this -- a listing of filming locations of movies shot in San
            Francisco starting from 1924. You'll find the titles, locations, fun
            facts, names of the director, writer, actors, and studio for most of
            these films.
          </p>
          <p>To get started try a search for "Basic Instinct".</p>
          <button onClick={this.props.handleOverlayClose}>Get Started</button>
        </div>
      </div>
    );
  }
}
export default OnboardOverlay;
