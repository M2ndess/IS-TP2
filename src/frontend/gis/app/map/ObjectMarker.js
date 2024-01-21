"use client";
import { Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";
import ContactsIcon from "@mui/icons-material/Contacts";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { icon as leafletIcon, point } from "leaflet";

export function ObjectMarker({ coordinates, properties }) {
  const { id, imgUrl, name, country } = properties;

  return (
    <Marker
      position={[coordinates.latitude, coordinates.longitude]}
      icon={leafletIcon({
        iconUrl: imgUrl,
        iconRetinaUrl: imgUrl,
        iconSize: point(50, 50),
      })}
    >
      <Popup>
        <List dense={true}>
          <ListItem>
            <ListItemIcon>
              <Avatar alt={name} src={imgUrl} />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FlagIcon style={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <span>
                  {country} - {coordinates.latitude}, {coordinates.longitude}
                  <br />
                  <label style={{ fontSize: "xx-small" }}>(Country - Coordinates)</label>
                </span>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ContactsIcon style={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <span>
                  Country Name: {name}
                  <br />
                  <label style={{ fontSize: "xx-small" }}>(Country Name)</label>
                </span>
              }
            />
          </ListItem>
        </List>
      </Popup>
    </Marker>
  );
}
