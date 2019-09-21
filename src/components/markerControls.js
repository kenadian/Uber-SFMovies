import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from "@material-ui/core/";
import { DeleteForever, ToggleOff, ToggleOn } from "@material-ui/icons/";

function MarkerControls(props) {
  const { movieDetails, clearMarkers, showMarkers, deleteMarkers } = props;
  return (
    <List>
      <ListItem button disabled={!movieDetails} onClick={clearMarkers}>
        <ListItemIcon>
          <ToggleOff />
        </ListItemIcon>
        <ListItemText primary="Hide Markers" />
      </ListItem>
      <ListItem button disabled={!movieDetails} onClick={showMarkers}>
        <ListItemIcon>
          <ToggleOn />
        </ListItemIcon>
        <ListItemText primary="Show Markers" />
      </ListItem>

      <Divider />

      <ListItem button disabled={!movieDetails} onClick={deleteMarkers}>
        <ListItemIcon style={{ color: "red" }}>
          <DeleteForever />
        </ListItemIcon>
        <ListItemText>
          <Typography color="error" variant="subtitle1">
            Delete Markers
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  );
}
export default MarkerControls;
