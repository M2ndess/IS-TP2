"use client";
import React, { useEffect, useState } from 'react';
import crudAPI from '../crud/crudAPI';

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await crudAPI().GET('/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Erro ao buscar teams:', error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <main>
      <b>Countries Page</b>:
      <ul>
        {countries.map((country) => (
          <li key={country.id}>{country.name}</li>
        ))}
      </ul>
    </main>
  );
}
