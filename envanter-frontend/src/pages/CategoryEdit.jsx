import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Autocomplete,
  Alert,
  Grid,
  Fade,
} from "@mui/material";
import {
  getAllCategories,
  addCategory,
  deleteCategory,
  renameCategory,
} from "../services/categoryService";
import { getProductsByCategory } from "../services/productService";

const labelSx = {
  color: "text.primary",
  "&.Mui-focused": { color: "text.primary" },
  "&.MuiInputLabel-shrink": { color: "text.primary" },
};

export default function CategoryEdit() {
  const [categories, setCategories] = useState([]);
  const [addName, setAddName] = useState("");
  const [deleteCategoryValue, setDeleteCategoryValue] = useState(null);
  const [renameCategoryValue, setRenameCategoryValue] = useState(null);
  const [newRename, setNewRename] = useState("");

  const [addStatus, setAddStatus] = useState({ success: null, message: "" });
  const [deleteStatus, setDeleteStatus] = useState({ success: null, message: "" });
  const [renameStatus, setRenameStatus] = useState({ success: null, message: "" });

  const [showAddStatus, setShowAddStatus] = useState(false);
  const [showDeleteStatus, setShowDeleteStatus] = useState(false);
  const [showRenameStatus, setShowRenameStatus] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [relatedProductCount, setRelatedProductCount] = useState(0);

  const showTemporaryMessage = (setStatus, setShowStatus, newStatus) => {
    setStatus(newStatus);
    setShowStatus(true);
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };

  const refreshCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const handleAdd = async () => {
    if (!addName.trim()) {
      showTemporaryMessage(setAddStatus, setShowAddStatus, {
        success: false,
        message: "Kategori adı girin.",
      });
      return;
    }
    try {
      await addCategory(addName.trim());
      showTemporaryMessage(setAddStatus, setShowAddStatus, {
        success: true,
        message: "Kategori eklendi.",
      });
      setAddName("");
      refreshCategories();
    } catch {
      showTemporaryMessage(setAddStatus, setShowAddStatus, {
        success: false,
        message: "Kategori eklenemedi.",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteCategoryValue) {
      showTemporaryMessage(setDeleteStatus, setShowDeleteStatus, {
        success: false,
        message: "Silinecek kategoriyi seçin.",
      });
      return;
    }

    try {
      const relatedProducts = await getProductsByCategory(
        deleteCategoryValue.categoryId
      );

      if (relatedProducts.length > 0) {
        setRelatedProductCount(relatedProducts.length);
        setShowDeleteConfirm(true);
        return;
      }

      await deleteCategory(deleteCategoryValue.categoryId);
      showTemporaryMessage(setDeleteStatus, setShowDeleteStatus, {
        success: true,
        message: "Kategori silindi.",
      });
      setDeleteCategoryValue(null);
      refreshCategories();
    } catch {
      showTemporaryMessage(setDeleteStatus, setShowDeleteStatus, {
        success: false,
        message: "Kategori silinemedi.",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(deleteCategoryValue.categoryId);
      showTemporaryMessage(setDeleteStatus, setShowDeleteStatus, {
        success: true,
        message: `Kategori ve bağlı ${relatedProductCount} ürün silindi.`,
      });
      setDeleteCategoryValue(null);
      setShowDeleteConfirm(false);
      refreshCategories();
    } catch {
      showTemporaryMessage(setDeleteStatus, setShowDeleteStatus, {
        success: false,
        message: "Kategori silinemedi.",
      });
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    showTemporaryMessage(setDeleteStatus, setShowDeleteStatus, {
      success: false,
      message: "Silme işlemi iptal edildi.",
    });
  };

  const handleRename = async () => {
    if (!renameCategoryValue || !newRename.trim()) {
      showTemporaryMessage(setRenameStatus, setShowRenameStatus, {
        success: false,
        message: "Kategori ve yeni adı seçin.",
      });
      return;
    }
    try {
      await renameCategory(renameCategoryValue.categoryId, newRename.trim());
      showTemporaryMessage(setRenameStatus, setShowRenameStatus, {
        success: true,
        message: "Kategori adı değiştirildi.",
      });
      setRenameCategoryValue(null);
      setNewRename("");
      refreshCategories();
    } catch {
      showTemporaryMessage(setRenameStatus, setShowRenameStatus, {
        success: false,
        message: "Kategori adı değiştirilemedi.",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "50vh",
        py: 10,
        px: { xs: 0, md: 4 },
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid rowSpacing={3} container spacing={6} justifyContent="center">

        {/* Kategori Ekle */}
        <Grid>
          <Paper
            sx={{
              width: 340,
              height: 203,
              p: 3,
              bgcolor: "background.default",
              color: "text.primary",
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Kategori Ekle
            </Typography>
            <TextField
              label="Kategori Adı"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              fullWidth
              InputLabelProps={{ sx: labelSx }}
              inputProps={{ style: { color: "text.primary" } }}
              sx={{ mb: 2 }}
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
                {addStatus.message && (
                  <Alert severity={addStatus.success ? "success" : "error"}>
                    {addStatus.message}
                  </Alert>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Kategori Sil */}
        <Grid>
          <Paper
            sx={{
              width: 340,
              minHeight: 150,
              p: 3,
              bgcolor: "background.default",
              color: "text.primary",
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Kategori Sil
            </Typography>
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.categoryId === value.categoryId
              }
              value={deleteCategoryValue}
              onChange={(e, val) => {
                setDeleteCategoryValue(val);
                setShowDeleteConfirm(false);
              }}
              componentsProps={{
                paper: { sx: { bgcolor: "background.paper", color: "text.primary" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kategori Seç"
                  fullWidth
                  InputLabelProps={{ sx: labelSx }}
                  inputProps={{
                    ...params.inputProps,
                    style: { color: "text.primary" },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Button
              variant="contained"
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

            {showDeleteConfirm && (
              <Box
                sx={{
                  mt: 2,
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.primary", mb: 0 }}>
                  Bu kategoriye bağlı {relatedProductCount} ürün var. Yine de silinsin mi?
                </Typography>
                <Box display="flex" gap={2} mt={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ color: "error.main", borderColor: "error.main" }}
                    onClick={handleConfirmDelete}
                  >
                    Evet
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCancelDelete}
                    sx={{ color: "success.main", borderColor: "success.main" }}
                  >
                    Hayır
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
          <Grid sx={{ mt: 2, height: 40 }}>
            <Fade in={showDeleteStatus} timeout={1500}>
              <Box sx={{ width: "100%" }}>
                {deleteStatus.message && (
                  <Alert severity={deleteStatus.success ? "success" : "error"}>
                    {deleteStatus.message}
                  </Alert>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Kategori Adı Değiştir */}
        <Grid>
          <Paper
            sx={{
              width: 340,
              height: 270,
              p: 3,
              bgcolor: "background.default",
              color: "text.primary",
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Kategori Adı Değiştir
            </Typography>
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.categoryId === value.categoryId
              }
              value={renameCategoryValue}
              onChange={(e, val) => setRenameCategoryValue(val)}
              componentsProps={{
                paper: { sx: { bgcolor: "background.paper", color: "text.primary" } },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kategori Seç"
                  fullWidth
                  InputLabelProps={{ sx: labelSx }}
                  inputProps={{
                    ...params.inputProps,
                    style: { color: "text.primary" },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <TextField
              label="Yeni Ad"
              value={newRename}
              onChange={(e) => setNewRename(e.target.value)}
              fullWidth
              InputLabelProps={{ sx: labelSx }}
              inputProps={{ style: { color: "text.primary" } }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleRename}
              fullWidth
              sx={{
                backgroundColor: "rgba(68, 129, 160, 0.5)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(18, 93, 131, 0.5)" },
              }}
            >
              Değiştir
            </Button>
          </Paper>
          <Grid sx={{ mt: 2, height: 40 }}>
            <Fade in={showRenameStatus} timeout={1500}>
              <Box sx={{ width: "100%" }}>
                {renameStatus.message && (
                  <Alert severity={renameStatus.success ? "success" : "error"}>
                    {renameStatus.message}
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
