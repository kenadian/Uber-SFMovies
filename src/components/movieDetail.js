import React from "react";
import { Typography, Grid, Button } from "@material-ui/core/";
function MovieDetail(props) {
  const { movieDetails, handleOnClickDetails, showDetails } = props;
  return (
    <React.Fragment>
      <Typography variant="h4">{movieDetails.title}</Typography>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item>
          <Typography variant="body1">{movieDetails.release_year}</Typography>
        </Grid>
        <Grid item>
          <Button type="link" onClick={handleOnClickDetails}>
            {showDetails && `Hide Details`}
            {!showDetails && `Show Details`}
          </Button>
        </Grid>
      </Grid>

      {showDetails && (
        <div>
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

          <Typography variant="body1">
            {movieDetails.production_company}
          </Typography>
          <Typography variant="h6">Distributor</Typography>

          <Typography variant="body1">{movieDetails.distributor}</Typography>
        </div>
      )}
    </React.Fragment>
  );
}

export default MovieDetail;
