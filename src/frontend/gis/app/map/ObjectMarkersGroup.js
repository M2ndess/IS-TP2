import React, { useEffect, useState } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { ObjectMarker } from './ObjectMarker';
import crudAPI from '../crud/crudAPI';

function CountryMarkersGroup() {
  const map = useMap();
  const [countries, setCountries] = useState([]);
  const axios = crudAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.GET('/get_countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
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
              coordinates: country.coordinates.coordinates,
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

export default CountryMarkersGroup;
