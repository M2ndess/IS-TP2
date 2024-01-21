"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  ListItem,
  ListItemText,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import useAPI from "../crud/crudAPI";
import TextField from '@mui/material/TextField';

function PlayersPage() {
  const { GET } = useAPI();

  const [minAgeInput, setMinAgeInput] = useState("");
  const [maxAgeInput, setMaxAgeInput] = useState("");
  const [Data, setData] = useState(null);

  const handleAgeInputChange = async () => {
    try {
      const result = await GET(`/players_age?min_age=${minAgeInput}&max_age=${maxAgeInput}`);
      console.log("Server response:", result.data);

      if (result.data) {
        const apidata = result.data.map(([name, age]) => {
          return { name, age };
        });
        setData(apidata);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Players by Age
        </Typography>
        <TextField
          label="Idade Mínima"
          variant="outlined"
          fullWidth
          value={minAgeInput}
          onChange={(e) => setMinAgeInput(e.target.value)}
        />
        <TextField
          label="Idade Máxima"
          variant="outlined"
          fullWidth
          value={maxAgeInput}
          onChange={(e) => setMaxAgeInput(e.target.value)}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAgeInputChange}
          >
            Pesquisar
          </Button>
        </Box>
        <Box mt={2}>
          <Paper>
            <Box p={2}>
              {Data ? (
                <Box>
                  {Data.map((data, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${data.name} - Idade: ${data.age}`} />
                    </ListItem>
                  ))}
                </Box>
              ) : (
                (minAgeInput || maxAgeInput) ? <CircularProgress /> : "--"
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default PlayersPage;
