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
  Button,
  Alert,
  Fade,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export default function DeletedProductsTable() {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [status, setStatus] = useState({ success: null, message: "" });
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5184/api/Product/Last10Deleted")
      .then((res) => res.json())
      .then((data) => setDeletedProducts(Array.isArray(data) ? data : []));
  }, []);

  const restoreProduct = async (originalProductId) => {
    try {
      const response = await fetch(
        `http://localhost:5184/api/Product/Restore/${originalProductId}`,
        { method: "POST" }
      );

      if (response.ok) {
        setDeletedProducts((prev) =>
          prev.filter((p) => p.originalProductId !== originalProductId)
        );
        showAlert(true, "Ürün başarıyla geri yüklendi.");
      } else {
        const errorText = await response.text();
        showAlert(false, errorText || "Geri yükleme başarısız.");
      }
    } catch (err) {
      console.error(err);
      showAlert(false, "Bir hata oluştu.");
    }
  };

  const showAlert = (isSuccess, msg) => {
    setStatus({ success: isSuccess, message: msg });
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
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
          maxWidth: 1200,
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
              color="text.primary"
              sx={{ textAlign: "center", width: "100%" }}
            >
              Silinen Son 10 Ürün
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "background.default",
                width: "100%",
                boxSizing: "border-box",
                overflowX: "auto",
              }}
            >
              <Table size="small" sx={{ width: "100%", tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "background.paper" }}>
                    <TableCell sx={cellHeaderStyle()}>Adı</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Stok</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Kategori</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Marka</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Ürün ID</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Açıklama</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Silinme Tarihi</TableCell>
                    <TableCell sx={cellHeaderStyle()}>Silen Kişi</TableCell>
                    <TableCell sx={cellHeaderStyle()} align="center">
                      İşlem
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deletedProducts.map((p) => (
                    <TableRow key={uuidv4()}>
                      <TableCell sx={cellBodyStyle()}>{p.name}</TableCell>
                      <TableCell sx={cellBodyStyle()}>{p.quantity}</TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.categoryName || "Bilinmiyor"}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.brand || "Yok"}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.originalProductId}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.description || "Yok"}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.deletedAt &&
                          new Date(p.deletedAt).toLocaleString("tr-TR")}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()}>
                        {p.deletedBy || "—"}
                      </TableCell>
                      <TableCell sx={cellBodyStyle()} align="center">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => restoreProduct(p.originalProductId)}
                        >
                          Kurtar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {deletedProducts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        align="center"
                        sx={{ color: "text.primary" }}
                      >
                        Silinen ürün yok.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Ürün Kurtar Uyarı Mesajı */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Fade in={showStatus} timeout={1500}>
                <Alert
                  severity={status.success ? "success" : "error"}
                  sx={{
                    fontWeight: "bold",
                    minWidth: 300,
                    textAlign: "center",
                  }}
                >
                  {status.message}
                </Alert>
              </Fade>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

const cellHeaderStyle = () => ({
  color: "text.primary",
  fontWeight: "bold",
  fontSize: { xs: 13, md: 16 },
  whiteSpace: "normal",
  wordBreak: "break-word",
});

const cellBodyStyle = () => ({
  color: "text.primary",
  fontWeight: "bold",
  fontSize: { xs: 13, md: 15 },
  whiteSpace: "normal",
  wordBreak: "break-word",
});
