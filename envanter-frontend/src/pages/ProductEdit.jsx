import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Alert,
  Grid,
  Fade,
} from "@mui/material";
import {
  getAllProducts,
  updateProductDescription,
  updateProductCategory as changeProductCategory,
} from "../services/productService";
import { getAllCategories } from "../services/categoryService";

const labelSx = {
  color: "#fff",
  "&.Mui-focused": { color: "#fff" },
  "&.MuiInputLabel-shrink": { color: "#fff" },
};

export default function ProductEdit() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProductTop, setSelectedProductTop] = useState(null);
  const [selectedProductBottom, setSelectedProductBottom] = useState(null);
  const [newName, setNewName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [statusTop, setStatusTop] = useState({ success: null, message: "" });
  const [statusBottom, setStatusBottom] = useState({
    success: null,
    message: "",
  });
  const [showTopStatus, setShowTopStatus] = useState(false);
  const [showBottomStatus, setShowBottomStatus] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      const productData = await getAllProducts();
      const categoryData = await getAllCategories();
      setProducts(productData);
      setCategories(categoryData);
    }
    fetchInitialData();
  }, []);

  const showTemporaryMessage = (setStatus, setShowStatus, newStatus) => {
    setStatus(newStatus);
    setShowStatus(true);
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };

  const handleRename = async () => {
    if (!selectedProductTop || !newName.trim()) {
      showTemporaryMessage(setStatusTop, setShowTopStatus, {
        success: false,
        message: "Lütfen eski ürünü seçin ve yeni adı girin.",
      });
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5184/api/Product/Rename/${selectedProductTop.productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName }),
        }
      );
      if (response.ok) {
        showTemporaryMessage(setStatusTop, setShowTopStatus, {
          success: true,
          message: "Ürün adı başarıyla değiştirildi.",
        });
        setNewName("");
        const updated = await getAllProducts();
        setProducts(updated);
      } else {
        showTemporaryMessage(setStatusTop, setShowTopStatus, {
          success: false,
          message: "Bir hata oluştu. Ürün adı değiştirilemedi.",
        });
      }
    } catch {
      showTemporaryMessage(setStatusTop, setShowTopStatus, {
        success: false,
        message: "Sunucu hatası. Tekrar deneyin.",
      });
    }
  };

  const handleCategoryChange = async () => {
    if (!selectedProductTop || !selectedCategory) {
      showTemporaryMessage(setStatusTop, setShowTopStatus, {
        success: false,
        message: "Lütfen ürün ve kategori seçin.",
      });
      return;
    }
    try {
      await changeProductCategory(
        selectedProductTop.productId,
        selectedCategory.categoryId
      );
      showTemporaryMessage(setStatusTop, setShowTopStatus, {
        success: true,
        message: "Kategori başarıyla değiştirildi.",
      });
      const updated = await getAllProducts();
      setProducts(updated);
    } catch {
      showTemporaryMessage(setStatusTop, setShowTopStatus, {
        success: false,
        message: "Kategori değiştirilemedi.",
      });
    }
  };

  const handleDescriptionUpdate = async () => {
    if (!selectedProductBottom || !newDescription.trim()) {
      showTemporaryMessage(setStatusBottom, setShowBottomStatus, {
        success: false,
        message: "Lütfen ürün seçin ve yeni açıklama girin.",
      });
      return;
    }
    try {
      await updateProductDescription(
        selectedProductBottom.productId,
        newDescription
      );
      showTemporaryMessage(setStatusBottom, setShowBottomStatus, {
        success: true,
        message: "Açıklama başarıyla değiştirildi.",
      });
      setNewDescription("");
      const updated = await getAllProducts();
      setProducts(updated);
    } catch {
      showTemporaryMessage(setStatusBottom, setShowBottomStatus, {
        success: false,
        message: "Bir hata oluştu. Açıklama değiştirilemedi.",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "35vh",
        bgcolor: "transparent",
        display: "flex",
        justifyContent: "center",
        pt: 10,
      }}
    >
      <Grid
        rowSpacing={3}
        container
        spacing={6}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ maxWidth: "1200px" }}
      >
        {/* Ad ve Kategori Kutusu */}
        <Grid sx={{ width: 480 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 2,
              bgcolor: "rgba(68, 129, 160, 0)",
              color: "#fff",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} gutterBottom>
              Ürün Adı / Kategorisi Değiştir
            </Typography>

            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name}
              value={selectedProductTop}
              onChange={(e, val) => setSelectedProductTop(val)}
              isOptionEqualToValue={(option, value) =>
                option.productId === value.productId
              }
              componentsProps={{
                paper: { sx: { bgcolor: "#5992cbff", color: "#fff" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ürün Seç"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{ sx: labelSx }}
                  InputProps={{
                    ...params.InputProps,
                    style: { color: "#ffffff" },
                  }}
                />
              )}
            />

            <TextField
              label="Yeni Ürün Adı"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              sx={{ mb: 2.5 }}
              InputLabelProps={{ sx: labelSx }}
              InputProps={{ style: { color: "#fff" } }}
            />

            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={selectedCategory}
              onChange={(e, val) => setSelectedCategory(val)}
              isOptionEqualToValue={(option, value) =>
                option.categoryId === value.categoryId
              }
              componentsProps={{
                paper: { sx: { bgcolor: "#5992cbff", color: "#fff" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Yeni Kategori"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{ sx: labelSx }}
                  InputProps={{
                    ...params.InputProps,
                    style: { color: "#ffffff" },
                  }}
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleRename}
                sx={{
                  flex: 1,
                  backgroundColor: "rgba(68, 129, 160, 0.3)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(18, 93, 131, 0.5)" },
                }}
              >
                Adı Değiştir
              </Button>
              <Button
                variant="contained"
                onClick={handleCategoryChange}
                sx={{
                  flex: 1,
                  backgroundColor: "rgba(68, 129, 160, 0.3)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(18, 93, 131, 0.5)" },
                }}
              >
                Kategoriyi Değiştir
              </Button>
            </Box>
          </Box>

          <Grid sx={{ mt: 2, height: 40 }}>
            <Fade in={showTopStatus} timeout={1500}>
              <Box sx={{ width: "100%" }}>
                {statusTop.message && (
                  <Alert severity={statusTop.success ? "success" : "error"}>
                    {statusTop.message}
                  </Alert>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Açıklama Kutusu */}
        <Grid sx={{ width: 480 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 2,
              bgcolor: "rgba(68, 129, 160, 0)",
              color: "#fff",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} gutterBottom>
              Açıklama Değiştir
            </Typography>

            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name}
              value={selectedProductBottom}
              onChange={(e, val) => setSelectedProductBottom(val)}
              isOptionEqualToValue={(option, value) =>
                option.productId === value.productId
              }
              componentsProps={{
                paper: { sx: { bgcolor: "#5992cbff", color: "#fff" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ürün Adı"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{ sx: labelSx }}
                  InputProps={{
                    ...params.InputProps,
                    style: { color: "#fff" },
                  }}
                />
              )}
            />

            <TextField
              label="Yeni Açıklama"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2.5 }}
              InputLabelProps={{ sx: labelSx }}
              InputProps={{ style: { color: "#fff" } }}
            />

            <Button
              variant="contained"
              onClick={handleDescriptionUpdate}
              fullWidth
              sx={{
                backgroundColor: "rgba(68, 129, 160, 0.3)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(18, 93, 131, 0.5)" },
              }}
            >
              Değiştir
            </Button>
          </Box>

          <Grid sx={{ mt: 2, height: 40 }}>
            <Fade in={showBottomStatus} timeout={1500}>
              <Box sx={{ width: "100%" }}>
                {statusBottom.message && (
                  <Alert severity={statusBottom.success ? "success" : "error"}>
                    {statusBottom.message}
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
