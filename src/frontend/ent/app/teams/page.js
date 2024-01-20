"use client";
import React, { useEffect, useState } from 'react';
import crudAPI from '../crud/crudAPI';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await crudAPI().GET('/teams');
        setTeams(response.data);
      } catch (error) {
        console.error('Erro ao buscar teams:', error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <main>
      <b>Teams Page</b>:
      <ul>
        {teams.map((team) => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
    </main>
  );
}
