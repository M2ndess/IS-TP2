import React, { useEffect, useState } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { ObjectMarker } from './ObjectMarker';
import crudAPI from '../crud/crudAPI';

function CountryMarkersGroup() {
  const map = useMap();
  const [countries, setCountries] = useState([]);
  const axios = crudAPI();

  const fetchCoordinates = async (id) => {
    try {
      const response = await axios.GET(`/get_text_coordinates?country_id=${id}`);
      const { latitude, longitude } = response.data;
      // Process latitude and longitude as needed
      console.log('Latitude:', latitude, 'Longitude:', longitude);
      return { latitude, longitude };
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      return { latitude: 0, longitude: 0 }; // Retornar valores padrão ou tratar o erro conforme necessário
    }
  };

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
  }, [axios]);

  return (
    <LayerGroup>
      {countries.map((country) => (
        <ObjectMarker
          key={country.id}
          coordinates={fetchCoordinates(country.id)}
          properties={{
            id: country.id,
            name: country.name,
            imgUrl: `https://cdn-icons-png.flaticon.com/512/805/805401.png`,
          }}
        />
      ))}
    </LayerGroup>
  );
}

export default CountryMarkersGroup;
