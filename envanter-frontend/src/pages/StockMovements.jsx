import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Button,
  Box,
  MenuItem,
  Grid,
  Alert,
  Fade,
} from "@mui/material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

export default function StockMovements() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [quantityChange, setQuantityChange] = useState(0);
  const [movementType, setMovementType] = useState("in");

  const [status, setStatus] = useState({ success: null, message: "" });
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5184/api/Product")
      .then((res) => {
        const formatted = res.data.map((p) => ({
          label: p.name,
          id: p.productId,
        }));
        setProducts(formatted);
      })
      .catch((err) => {
        console.error("Ürünler alınamadı:", err);
      });
  }, []);

  const handleProductChange = async (event, value) => {
    setSelectedProduct(value);
    if (value) {
      await fetchMovements(value.id);
    } else {
      setMovements([]);
    }
  };

  const fetchMovements = async (productId) => {
    try {
      const res = await axios.get(
        `http://localhost:5184/api/StockMovements/Product/${productId}`
      );
      setMovements(res.data);
    } catch (error) {
      console.error("Stok hareketleri alınamadı:", error);
    }
  };

  const showTemporaryMessage = (newStatus) => {
    setStatus(newStatus);
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  const handleAddMovement = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      showTemporaryMessage({
        success: false,
        message: "Lütfen bir ürün seçin.",
      });
      return;
    }
    if (quantityChange < 1) {
      showTemporaryMessage({
        success: false,
        message: "Hareket miktarı en az 1 olmalı.",
      });
      return;
    }
    try {
      await axios.post("http://localhost:5184/api/StockMovements", {
        productId: selectedProduct.id,
        quantity: parseInt(quantityChange),
        movementType,
      });
      showTemporaryMessage({
        success: true,
        message: "Stok başarıyla güncellendi.",
      });
      setQuantityChange(0);
      fetchMovements(selectedProduct.id);
    } catch (error) {
      showTemporaryMessage({
        success: false,
        message: "Stok hareketi eklenemedi.",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "40vh",
        width: "100%",
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
        bgcolor: "transparent",
        mt: 10,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          px: { xs: 1, md: 2 },
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid sx={{ width: "100%" }}>
            
            {/* Ana Kutu */}
            <Box
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 3,
                boxShadow: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
                bgcolor: "background.paper",
                color: "text.primary",
              }}
            >
              <Typography variant="h5" fontWeight={700}>
                Stok Yönetimi
              </Typography>

              {/* Ürün Seç */}
              <Box sx={{ width: { xs: "100%", sm: 400, md: 500 } }}>
                <Autocomplete
                  options={products}
                  value={selectedProduct}
                  onChange={handleProductChange}
                  getOptionLabel={(option) => option?.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  componentsProps={{
                    paper: { sx: { bgcolor: "background.paper", color: "text.primary" } },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ürün Seçin"
                      fullWidth
                      InputLabelProps={{ sx: { color: "text.primary" } }}
                      sx={{
                        "& .MuiInputBase-input": { color: "text.primary" },
                      }}
                    />
                  )}
                />
              </Box>

              {selectedProduct && (
                <>
                  {/* Hareket Türü ve Miktar */}
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 400, md: 500 },
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <TextField
                      select
                      label="Hareket Türü"
                      value={movementType}
                      onChange={(e) => setMovementType(e.target.value)}
                      fullWidth
                      InputLabelProps={{ sx: { color: "text.primary" } }}
                      sx={{
                        "& .MuiInputBase-input": { color: "text.primary" },
                        borderRadius: 2,
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: { bgcolor: "background.paper", color: "text.primary" },
                          },
                        },
                      }}
                    >
                      <MenuItem value="in">Ekleme</MenuItem>
                      <MenuItem value="out">Çıkarma</MenuItem>
                    </TextField>

                    <TextField
                      type="number"
                      label="Miktar"
                      value={quantityChange}
                      onChange={(e) => setQuantityChange(e.target.value)}
                      fullWidth
                      InputLabelProps={{ sx: { color: "text.primary" } }}
                      sx={{
                        "& .MuiInputBase-input": { color: "text.primary" },
                        borderRadius: 2,
                      }}
                      inputProps={{ min: 1 }}
                    />
                  </Box>

                  {/* Kaydet Butonu */}
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleAddMovement}
                    fullWidth
                    sx={{
                      backgroundColor: "primary.main",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    Stok Güncelle
                  </Button>

                  {/* Hareket Geçmişi */}
                  <Box sx={{ width: { xs: "100%", sm: 400, md: 500 }, mt: 2 }}>
                    <Typography variant="h6" gutterBottom textAlign="center">
                      <span style={{ fontWeight: 700 }}>
                        {selectedProduct.label}
                      </span>{" "}
                      Ürün Hareketleri:
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.default",
                        minHeight: 50,
                      }}
                    >
                      {movements.length === 0 ? (
                        <Typography color="text.primary" textAlign="center">
                          Henüz stok hareketi yok.
                        </Typography>
                      ) : (
                        movements.map((move) => (
                          <Typography
                            key={move.movementId}
                            color="text.primary"
                          >
                            {new Date(move.movementDate).toLocaleString()} —{" "}
                            {move.movementType === "out" ? "-" : "+"}
                            {move.quantity}
                          </Typography>
                        ))
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {/* Kutunun Altındaki Uyarı */}
            <Grid sx={{ mt: 2, height: 40, width: "100%" }}>
              <Fade in={showStatus} timeout={1500}>
                <Box sx={{ width: "100%" }}>
                  {status.message && (
                    <Alert severity={status.success ? "success" : "error"}>
                      {status.message}
                    </Alert>
                  )}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
