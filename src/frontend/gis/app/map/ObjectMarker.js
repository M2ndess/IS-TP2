import React from "react";
import { Marker, Popup } from 'react-leaflet';
import { Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import FlagIcon from '@mui/icons-material/Flag';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import ContactsIcon from '@mui/icons-material/Contacts';
import { icon as leafletIcon, point } from "leaflet";

const LIST_PROPERTIES = [
    { "key": "country", label: "Country", Icon: FlagIcon },
    { "key": "number", label: "Shirt Number", Icon: ContactsIcon },
    { "key": "position", label: "Position", Icon: PictureInPictureAltIcon }
];

export function ObjectMarker({ geoJSON }) {
    const properties = geoJSON?.properties || {};
    const { name, country, imgUrl, number, position } = properties;
    const coordinates = geoJSON?.geometry?.coordinates || [0, 0];

    return (
        <Marker
            position={coordinates}
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
                            <Avatar alt={name} src={properties.imgUrl} />
                        </ListItemIcon>
                        <ListItemText primary={name} />
                    </ListItem>
                    {LIST_PROPERTIES.map((property) => (
                        <ListItem key={property.key}>
                            <ListItemIcon>
                                <property.Icon style={{ color: "black" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<span>
                                    {property.label}: {properties[property.key]}<br />
                                    <label style={{ fontSize: "xx-small" }}>({property.label})</label>
                                </span>}
                            />
                        </ListItem>
                    ))}
                </List>
            </Popup>
        </Marker>
    )
}
