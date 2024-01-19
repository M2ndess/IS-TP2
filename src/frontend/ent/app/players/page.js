"use client";
import { useCallback, useEffect, useState } from "react";
import {
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function PlayersPage({ pagea }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const [data, setData] = useState(null);
  const [maxDataSize, setMaxDataSize] = useState(0);

  const page = parseInt(searchParams.get("page")) || 1;
  const PAGE_SIZE = 10;

  useEffect(() => {
    setData(null);

    const apiUrl =
      process.env.NEXT_PUBLIC_API_ENTITIES_URL || "http://api-entities:8080";
    const apiEndpoint = `${apiUrl}/players?page=${page}&pageSize=${PAGE_SIZE}`;

    fetch(apiEndpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data.players);
        setMaxDataSize(data.totalCount);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, [page]);

  return (
    <>
      <h1 sx={{ fontSize: "100px" }}>Players</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "lightgray" }}>
              <TableCell component="th" width={"1px"} align="center">
                ID
              </TableCell>
              <TableCell>Player Name</TableCell>
              <TableCell align="center">Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="td" align="center">
                    {row.id}
                  </TableCell>
                  <TableCell component="td" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="td" align="center" scope="row">
                    {row.age}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {maxDataSize && (
        <Pagination
          style={{ color: "black", marginTop: 8 }}
          variant="outlined"
          shape="rounded"
          color={"primary"}
          onChange={(e, v) => {
            router.push(pathname + "?" + createQueryString("page", v));
          }}
          page={page}
          count={Math.ceil(maxDataSize / PAGE_SIZE)}
        />
      )}
    </>
  );
}
