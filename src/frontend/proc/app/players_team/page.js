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

  const [manualTeamInput, setManualTeamInput] = useState("");
  const [Data, setData] = useState(null);

  const handleTeamInputChange = async () => {
    try {
      const result = await GET(`/players_team?nome_team=${manualTeamInput}`);
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
          Players by Team
        </Typography>
        <TextField
          label="Introduza o nome da equipa"
          variant="outlined"
          fullWidth
          value={manualTeamInput}
          onChange={(e) => setManualTeamInput(e.target.value)}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTeamInputChange}
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
                    // Use split(',') to get an array of player names
                    data.player[0].split(',').map((playerName, playerIndex) => (
                      <ListItem key={`${index}-${playerIndex}`}>
                        <ListItemText primary={playerName.replace(/[{}]/g, '').trim()} />
                      </ListItem>
                    ))
                  ))}
                </Box>
              ) : (
                manualTeamInput ? <CircularProgress /> : "--"
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default PlayersPage;