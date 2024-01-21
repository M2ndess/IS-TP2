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
        // Obter dados dos países
        const countriesResponse = await axios.GET('/get_countries');
        const countriesData = countriesResponse.data;

        // Para cada país, obter coordenadas e atualizar o estado
        const countriesWithCoordinates = await Promise.all(
          countriesData.map(async (country) => {
            const coordinatesResponse = await axios.GET(`/get_text_coordinates?country_id=${country.id}`);
            const coordinatesData = coordinatesResponse.data;
            return {
              id: country.id,
              name: country.name,
              geoJSON: {
                type: 'feature',
                geometry: {
                  type: 'Point',
                  coordinates: [coordinatesData.longitude, coordinatesData.latitude],
                },
                properties: {
                  id: country.id,
                  name: country.name,
                  imgUrl: `https://cdn-icons-png.flaticon.com/512/805/805401.png`,
                },
              },
            };
          })
        );

        setCountries(countriesWithCoordinates);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <LayerGroup>
      {countries.map((country) => (
        <ObjectMarker key={country.id} geoJSON={country.geoJSON} />
      ))}
    </LayerGroup>
  );
}

export default CountryMarkersGroup;
