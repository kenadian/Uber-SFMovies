import React from "react";
import { Typography } from "@material-ui/core/";
function MovieDetail(props) {
  const { movieDetails } = props;
  return (
    <React.Fragment>
      <Typography variant="h5">{movieDetails.title}</Typography>
      <Typography variant="body1">{movieDetails.release_year}</Typography>
      <Typography variant="h6">Actors</Typography>

      <Typography variant="body1">
        {movieDetails.actor_1 ? `${movieDetails.actor_1}, ` : ""}
        {movieDetails.actor_2 ? `${movieDetails.actor_2}` : ""}
        {movieDetails.actor_3 ? `, ` : ""}
        {movieDetails.actor_3 ? `${movieDetails.actor_3}` : ""}
      </Typography>
      <Typography variant="h6">Writer</Typography>

      <Typography variant="body1">{movieDetails.writer}</Typography>
      <Typography variant="h6">Director</Typography>

      <Typography variant="body1">{movieDetails.director}</Typography>

      <Typography variant="h6">Production Company</Typography>

      <Typography variant="body1">{movieDetails.production_company}</Typography>
      <Typography variant="h6">Distributor</Typography>

      <Typography variant="body1">{movieDetails.distributor}</Typography>
    </React.Fragment>
  );
}

export default MovieDetail;
