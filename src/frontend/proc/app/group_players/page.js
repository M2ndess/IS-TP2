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
  Button,
} from "@mui/material";
import useAPI from "../crud/crudAPI";

function PlayersPage() {
  const { GET } = useAPI();
  const [Data, setData] = useState(null);

  const handleFetchPlayersByWeightHeight = async () => {
    try {
      const result = await GET("/players_weight_height");
      console.log("Server response:", result.data);

      if (result.data) {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    handleFetchPlayersByWeightHeight();
  }, []);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Players by Weight and Height
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchPlayersByWeightHeight}
          >
            Atualizar Lista
          </Button>
        </Box>
        <Box mt={2}>
          <Paper>
            <Box p={2}>
              {Data ? (
                <Box>
                  {Data.map((player, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${player[2]} - Peso: ${player[0]} kg, Altura: ${player[1]} cm`} />
                    </ListItem>
                  ))}
                </Box>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default PlayersPage;
