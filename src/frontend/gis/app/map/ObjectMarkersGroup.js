import React, { useEffect, useState } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { ObjectMarker } from './ObjectMarker';
import useAPI from '../crud/crudAPI';
import wellknown from 'wellknown';

function ObjectMarkersGroup() {
  const map = useMap();
  const [countries, setCountries] = useState([]);
  const { GET } = useAPI();

  function convertHexWKTToLatLng(hexWKT) {
    // Converte a string hexadecimal para um array de bytes
    const hexArray = hexWKT.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));

    // O formato WKT (Well-Known Text) começa com um byte que representa o tipo de geometria.
    // No seu caso, a geometria é um ponto (tipo 0x01).
    const typeByte = hexArray[0];

    // Se o tipo não for ponto (0x01), ou se a geometria estiver vazia, retorna coordenadas padrão [0, 0]
    if (typeByte !== 0x01 || hexArray.length < 22) {
      return [0, 0];
    }

    // Extrai as coordenadas x e y da string hexadecimal e converte para números de ponto flutuante
    const x = Buffer.from(hexArray.slice(1, 9)).readDoubleLE(0);
    const y = Buffer.from(hexArray.slice(9, 17)).readDoubleLE(0);

    // Retorna as coordenadas em um array [latitude, longitude]
    return [y, x];
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GET('/get_countries');
        const countriesWithLatLng = response.data.map(country => ({
          ...country,
          coordinates: convertHexWKTToLatLng(country.coordinates),
        }));
        setCountries(countriesWithLatLng);
      } catch (error) {
        console.error('Erro na API:', error);
      }
    };

    fetchData();
  }, [GET]);

  return (
    <LayerGroup>
      {countries.map((country) => (
        <ObjectMarker
          key={country.id}
          geoJSON={{
            type: 'feature',
            geometry: {
              type: 'Point',
              coordinates: country.coordinates || [0, 0],
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
