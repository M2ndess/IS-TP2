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

  const [manualCountryInput, setManualCountryInput] = useState("");
  const [Data, setData] = useState(null);

  const handleCountryInputChange = async () => {
    try {
      const result = await GET(`/players_country?country=${manualCountryInput}`);
      if (result.data) {
        const apidata = result.data.map((player) => {
          return { player: player };
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
          Players by Country
        </Typography>
        <TextField
          label="Introduza o nome do país"
          variant="outlined"
          fullWidth
          value={manualCountryInput}
          onChange={(e) => setManualCountryInput(e.target.value)}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCountryInputChange}
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
                      <ListItemText primary={data.player[0]} />
                    </ListItem>
                  ))}
                </Box>
              ) : (
                manualCountryInput ? <CircularProgress /> : "--"
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default PlayersPage;
