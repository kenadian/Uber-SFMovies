import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core/";
const Loading = () => (
  <div className="loading-shading-mui">
    <CircularProgress
      style={{ height: 20, width: 20 }}
      className="loading-icon-mui"
    />
  </div>
);
export default Loading;
