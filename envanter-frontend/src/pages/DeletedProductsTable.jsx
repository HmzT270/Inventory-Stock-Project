import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

export default function DeletedProductsTable() {
  const [deletedProducts, setDeletedProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5184/api/Product/Last10Deleted")
      .then((res) => res.json())
      .then((data) => setDeletedProducts(Array.isArray(data) ? data : []));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          mx: "auto",
          px: { xs: 1, md: 2 },
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid sx={{ width: "100%" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={3}
              color="#ffffff"
              sx={{ textAlign: "center", width: "100%" }}
            >
              Silinen Son 10 Ürün
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "rgba(16, 132, 199, 0)",
                width: "100%",
                boxSizing: "border-box",
                overflowX: "auto",
              }}
            >
              <Table size="small" sx={{ width: "100%", tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#6baee8ff" }}>
                    <TableCell sx={cellHeaderStyle()}>Adı</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Stok</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Kategori</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Ürün ID</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Açıklama</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Silinme Tarihi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deletedProducts.map((p, index) => (
                    <TableRow
                      key={
                        p.deletedProductId ||
                        p.originalProductId ||
                        p.productId ||
                        index
                      }
                    >
                      <TableCell sx={cellBodyStyle()}>{p.name}</TableCell>
                      <TableCell sx={cellBodyStyle()}>{p.quantity}</TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.categoryName || p.categoryId || "Bilinmiyor"}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.originalProductId || p.productId}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.description || "Yok"}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.deletedAt &&
                          new Date(p.deletedAt).toLocaleString("tr-TR")}
                      </TableCell>
                    </TableRow>
                  ))}
                  {deletedProducts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ color: "#ffffff" }}
                      >
                        Silinen ürün yok.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

const cellHeaderStyle = () => ({
  color: "#ffffffff",
  fontWeight: "bold",
  fontSize: { xs: 13, md: 16 },
  whiteSpace: "normal",
  wordBreak: "break-word",
});

const cellBodyStyle = () => ({
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: { xs: 13, md: 15 },
  whiteSpace: "normal",
  wordBreak: "break-word",
});
