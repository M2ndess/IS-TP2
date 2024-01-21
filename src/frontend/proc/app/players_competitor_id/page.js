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

function PlayersByCompetitionId() {
  const { GET } = useAPI();

  const [competitionIdInput, setCompetitionIdInput] = useState("");
  const [playerData, setPlayerData] = useState(null);

  const handleCompetitionIdInputChange = async () => {
    try {
      const result = await GET(`/players_competitor_id?competitor_id=${competitionIdInput}`);
      console.log("Server response:", result.data);

      if (result.data && result.data.length > 0) {
        // Assuming the API response is an array with subarrays
        const [name, weight, height, team, competition, year] = result.data[0];
        setPlayerData({
          name: name.replace('{', '').replace('}', ''),
          weight: weight.replace('{', '').replace('}', ''),
          height: height.replace('{', '').replace('}', ''),
          team: team.replace('{', '').replace('}', ''),
          competition: competition.replace('{', '').replace('}', ''),
          year: year.replace('{', '').replace('}', ''),
        });
      } else {
        setPlayerData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPlayerData(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Player Details by Competition ID
        </Typography>
        <TextField
          label="Enter Competition ID"
          variant="outlined"
          fullWidth
          value={competitionIdInput}
          onChange={(e) => setCompetitionIdInput(e.target.value)}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompetitionIdInputChange}
          >
            Search
          </Button>
        </Box>
        <Box mt={2}>
          <Paper>
            <Box p={2}>
              {playerData ? (
                <Box>
                  <ListItem>
                    <ListItemText primary={`Player Name: ${playerData.name || 'N/A'}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Weight: ${playerData.weight || 'N/A'}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Height: ${playerData.height || 'N/A'}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Team Name: ${playerData.team || 'N/A'}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Competition Name: ${playerData.competition || 'N/A'}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Competition Year: ${playerData.year || 'N/A'}`} />
                  </ListItem>
                  {/* Add more properties as needed */}
                </Box>
              ) : (
                competitionIdInput ? <CircularProgress /> : "--"
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default PlayersByCompetitionId;