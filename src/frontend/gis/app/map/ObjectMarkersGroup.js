import React, { useEffect, useState } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { ObjectMarker } from './ObjectMarker';
import useAPI from "../crud/crudAPI";
import wellknown from 'wellknown';

function ObjectMarkersGroup() {
  const map = useMap();
  const [countries, setCountries] = useState([]);
  const { GET } = useAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GET('/get_countries');
        const countriesWithLatLng = response.data.map(country => {
          const coordinates = country.coords ? wellknown.parse(country.coords).coordinates.reverse() : null;
          return {
            ...country,
            coordinates: coordinates,
          };
        });
        setCountries(countriesWithLatLng);
      } catch (error) {
        console.error('Erro na API API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <LayerGroup>
      {countries.map((country) => (
        <ObjectMarker
          key={country.id}
          geoJSON={{
            type: 'feature',
            geometry: {
              type: 'Point',
              coordinates: country.coordinates,
            },
            properties: {
              id: country.id,
              name: country.name,
              imgUrl: `https://cdn-icons-png.flaticon.com/512/805/805401.png`,
            },
          }}
        />
      ))}
    </LayerGroup>
  );
}

export default ObjectMarkersGroup;
