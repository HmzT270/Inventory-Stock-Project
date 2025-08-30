import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  Alert,
  Fade,
} from "@mui/material";

function ProductManagement() {
  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");

  const [statusAdd, setStatusAdd] = useState({ success: null, message: "" });
  const [statusDelete, setStatusDelete] = useState({
    success: null,
    message: "",
  });
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [showDeleteStatus, setShowDeleteStatus] = useState(false);

  // Giriş yapan kullanıcı
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  useEffect(() => {
    fetch("http://localhost:5184/api/Category")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("http://localhost:5184/api/Brand")
      .then((res) => res.json())
      .then((data) => setBrands(data));

    fetch("http://localhost:5184/api/Product")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p) => ({
          label: p.name,
          productId: p.productId,
        }));
        setProducts(formatted);
      });
  }, []);

  const showTemporaryMessage = (setStatus, setShowStatus, newStatus) => {
    setStatus(newStatus);
    setShowStatus(true);
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };

  const handleAdd = async () => {
    if (!productName.trim() || !selectedCategory || !selectedBrand) {
      showTemporaryMessage(setStatusAdd, setShowAddStatus, {
        success: false,
        message: "Ürün adı, kategori ve marka seçilmelidir.",
      });
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    try {
      const res = await fetch("http://localhost:5184/api/Product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          quantity: quantity,
          categoryId: selectedCategory.categoryId,
          brandId: selectedBrand.brandId,
          description: description.trim() === "" ? null : description,
          createdBy: currentUser?.username || "Bilinmiyor",
        }),
      });

      if (res.ok) {
        setProductName("");
        setQuantity(0);
        setSelectedCategory(null);
        setSelectedBrand(null);
        setDescription("");
        showTemporaryMessage(setStatusAdd, setShowAddStatus, {
          success: true,
          message: "Ürün eklendi!",
        });
      } else {
        showTemporaryMessage(setStatusAdd, setShowAddStatus, {
          success: false,
          message: "Ürün eklenemedi.",
        });
      }
    } catch {
      showTemporaryMessage(setStatusAdd, setShowAddStatus, {
        success: false,
        message: "Ürün eklenemedi.",
      });
    }
  };

  const handleDeleteInputChange = (event, value) => {
    setDeleteInput(value);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (!selectedProduct) {
      showTemporaryMessage(setStatusDelete, setShowDeleteStatus, {
        success: false,
        message: "Önce bir ürün seçmelisiniz.",
      });
      return;
    }

    if (!currentUser) {
      showTemporaryMessage(setStatusDelete, setShowDeleteStatus, {
        success: false,
        message: "Kullanıcı oturumu bulunamadı.",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5184/api/Product/${selectedProduct.productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deletedBy: currentUser.username, // Silen kullanıcı
          }),
        }
      );

      if (response.ok) {
        setDeleteInput("");
        setSelectedProduct(null);
        showTemporaryMessage(setStatusDelete, setShowDeleteStatus, {
          success: true,
          message: "Ürün silindi!",
        });
      } else {
        showTemporaryMessage(setStatusDelete, setShowDeleteStatus, {
          success: false,
          message: "Ürün silinemedi.",
        });
      }
    } catch {
      showTemporaryMessage(setStatusDelete, setShowDeleteStatus, {
        success: false,
        message: "Ürün silinemedi.",
      });
    }
  };

  const labelSx = {
    color: "text.primary",
    "&.Mui-focused": { color: "text.primary" },
    "&.MuiInputLabel-shrink": { color: "text.primary" },
  };

  return (
    <Box
      sx={{
        minHeight: "62vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "transparent",
        py: 6,
        px: { xs: 1, md: 4 },
      }}
    >
      <Grid rowSpacing={3} container spacing={6} justifyContent="center">

        {/* Ürün Ekle Kutusu */}
        <Grid>
          <Paper
            sx={{
              width: 360,
              height: 505,
              p: 3,
              bgcolor: "background.default",
              color: "text.primary",
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Ürün Ekle
            </Typography>
            <TextField
              label="Ürün Adı"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              sx={{ mb: 2.5 }}
              InputLabelProps={{ sx: labelSx }}
              inputProps={{ style: { color: "text.primary" } }}
            />
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={selectedCategory}
              onChange={(e, val) => setSelectedCategory(val)}
              componentsProps={{
                paper: { sx: { bgcolor: "background.paper", color: "text.primary" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kategori"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{ sx: labelSx }}
                  inputProps={{
                    ...params.inputProps,
                    style: { color: "text.primary" },
                  }}
                />
              )}
            />
            <Autocomplete
              options={brands}
              getOptionLabel={(option) => option.name}
              value={selectedBrand}
              onChange={(e, val) => setSelectedBrand(val)}
              componentsProps={{
                paper: { sx: { bgcolor: "background.paper", color: "text.primary" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marka"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{ sx: labelSx }}
                  inputProps={{
                    ...params.inputProps,
                    style: { color: "text.primary" },
                  }}
                />
              )}
            />
            <TextField
              label="Stok Miktarı"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
              sx={{ mb: 2.5 }}
              InputLabelProps={{ sx: labelSx }}
              inputProps={{ min: 0, style: { color: "text.primary" } }}
            />
            <TextField
              label="Açıklama (Opsiyonel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              sx={{ mb: 2.5 }}
              InputLabelProps={{ sx: labelSx }}
              inputProps={{ style: { color: "text.primary" } }}
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              fullWidth
              sx={{
                backgroundColor: "rgba(68, 129, 160, 0.5)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(18, 93, 131, 0.5)" },
              }}
            >
              Ekle
            </Button>
          </Paper>
          <Grid sx={{ mt: 2, height: 40 }}>
            <Fade in={showAddStatus} timeout={1500}>
              <Box sx={{ width: "100%" }}>
                {statusAdd.message && (
                  <Alert severity={statusAdd.success ? "success" : "error"}>
                    {statusAdd.message}
                  </Alert>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Ürün Sil Kutusu */}
        <Grid>
          <Paper
            sx={{
              width: 360,
              height: 202,
              p: 3,
              bgcolor: "background.default",
              color: "text.primary",
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Ürün Sil
            </Typography>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.label || ""}
              inputValue={deleteInput}
              onInputChange={handleDeleteInputChange}
              onChange={(e, value) => setSelectedProduct(value)}
              componentsProps={{
                paper: { sx: { bgcolor: "background.paper", color: "text.primary" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ürün Adı"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{ sx: labelSx }}
                  inputProps={{
                    ...params.inputProps,
                    style: { color: "text.primary" },
                  }}
                />
              )}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              fullWidth
              sx={{
                backgroundColor: "rgba(199,36,36,0.5)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,59,59,0.6)" },
              }}
            >
              Sil
            </Button>
          </Paper>
          <Grid sx={{ mt: 2, height: 40 }}>
            <Fade in={showDeleteStatus} timeout={1500}>
              <Box sx={{ width: "100%" }}>
                {statusDelete.message && (
                  <Alert severity={statusDelete.success ? "success" : "error"}>
                    {statusDelete.message}
                  </Alert>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductManagement;
