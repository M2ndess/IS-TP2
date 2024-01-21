"use client";
import React, { useEffect, useState } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { ObjectMarker } from './ObjectMarker';
import useAPI from "../crud/crudAPI";
import wkbPolygon from 'wkb-polygon';

function ObjectMarkersGroup() {
  const map = useMap();
  const { GET } = useAPI();
  const [countries, setCountries] = useState([]);
  const [bounds, setBounds] = useState(map.getBounds());

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await GET('/get_countries');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type. Expected JSON.');
      }

      const data = await response.json();

      // Convert WKB coordinates to [latitude, longitude]
      const countriesWithLatLng = data.map((country) => ({
        ...country,
        coordinates: wkbPolygon.parse(country.coordinates),
      }));

      setCountries(countriesWithLatLng);
    } catch (error) {
      console.error('Error fetching data:', error);
      setCountries([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  // Setup the event to update the bounds automatically
  useEffect(() => {
    const cb = () => {
      setBounds(map.getBounds());
    };
    map.on('moveend', cb);

    return () => {
      map.off('moveend', cb);
    };
  }, [map]);

  // Updates the data for the current bounds
  useEffect(() => {
    console.log('> getting data for bounds', bounds);
    fetchData(); // Fetch data whenever bounds change
  }, [bounds]);

  return (
    <LayerGroup>
      {countries.map((country) => (
        <ObjectMarker key={country.id} country={country} />
      ))}
    </LayerGroup>
  );
}

export default ObjectMarkersGroup;
