import React, { useEffect, useState } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { ObjectMarker } from './ObjectMarker';
import crudAPI from '../crud/crudAPI';
import wellknown from 'wellknown';

function CountryMarkersGroup() {
  const map = useMap();
  const [countries, setCountries] = useState([]);
  const axios = crudAPI();

  // Função para converter string hexadecimal para decimal
  const hexToDec = (hexString) => parseInt(hexString, 16);

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
      {countries.map((country) => {
        // Converte a representação hexadecimal para decimal
        const decimalCoords = hexToDec(country.coordinates);
        // Converte as coordenadas WKB para [latitude, longitude]
        const coordinates = wellknown.parse(decimalCoords);

        // Verifica se as coordenadas não são nulas
        if (coordinates && coordinates.length === 2) {
          return (
            <ObjectMarker
              key={country.id}
              geoJSON={{
                type: 'feature',
                geometry: {
                  type: 'Point',
                  coordinates: coordinates.reverse(), // Inverte as coordenadas para [latitude, longitude]
                },
                properties: {
                  id: country.id,
                  name: country.name,
                  imgUrl: `https://cdn-icons-png.flaticon.com/512/805/805401.png`,
                },
              }}
            />
          );
        } else {
          // Adicione uma lógica de tratamento de erro ou simplesmente retorne null se as coordenadas não forem válidas
          return null;
        }
      })}
    </LayerGroup>
  );
}

export default CountryMarkersGroup;
