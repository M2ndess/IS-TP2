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

  const [manualOverallInput, setmanualOverallInput] = useState("");
  const [Data, setData] = useState(null);

  const handleOverallInputChange = async () => {
    try {
      const result = await GET(`/players_overall_rank?overall_rank=${manualOverallInput}`);
      console.log("Server response:", result.data);

      if (result.data) {
        const apidata = result.data.map(([name, overallRank]) => {
          return { name, overallRank };
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
          Players by Overall Rank
        </Typography>
        <TextField
          label="Introduza o overall máximo"
          variant="outlined"
          fullWidth
          value={manualOverallInput}
          onChange={(e) => setmanualOverallInput(e.target.value)}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOverallInputChange}
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
                      <ListItemText primary={`${data.name} - Overall Rank: ${data.overallRank}`} />
                    </ListItem>
                  ))}
                </Box>
              ) : (
                manualOverallInput ? <CircularProgress /> : "--"
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default PlayersPage;
