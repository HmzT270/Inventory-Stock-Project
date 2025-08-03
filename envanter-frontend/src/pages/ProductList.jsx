import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllCategories } from "../services/categoryService";
import { getAllBrands } from "../services/brandService";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  InputAdornment,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Alert,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myFont from "../fonts/OpenSansLight.js";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function ProductList() {
  const criticalRowClass = {
    backgroundColor: "error.light",
    color: "text.primary",
    fontWeight: "bold",
    animation: "critical-blink 1s linear infinite alternate",
  };

  const criticalRowStyle = `
@keyframes critical-blink {
from { background-color: rgba(199,36,36,0.68); }
to { background-color: rgba(255,59,59,0.96); }
}
`;

  const productFilters = [
    { value: "all", name: "Tüm Ürünler" },
    { value: "critical", name: "Kritik Stoktaki Ürünler" },
    { value: "outofstock", name: "Stokta Olmayan Ürünler" },
    { value: "favorites", name: "Favori Ürünler" },
  ];

  const sortOptionsList = [
    { value: "serialnumber_asc", name: "Sıra No (Artan)" },
    { value: "serialnumber_desc", name: "Sıra No (Azalan)" },
    { value: "name_asc", name: "Ad (A-Z)" },
    { value: "name_desc", name: "Ad (Z-A)" },
    { value: "quantity_asc", name: "Stok (Artan)" },
    { value: "quantity_desc", name: "Stok (Azalan)" },
    { value: "category_asc", name: "Kategori (A-Z)" },
    { value: "category_desc", name: "Kategori (Z-A)" },
    { value: "brand_asc", name: "Marka (A-Z)" },
    { value: "brand_desc", name: "Marka (Z-A)" },
    { value: "createdAt_desc", name: "Eklenme Tarihi (Azalan)" },
    { value: "createdAt_asc", name: "Eklenme Tarihi (Artan)" },
  ];

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Dizi!
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [criticalLevel, setCriticalLevel] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("serialnumber_asc");
  const [showFavoritesIcon, setShowFavoritesIcon] = useState(false); // ⭐ Yıldız gösterimi
  const [favoriteStatus, setFavoriteStatus] = useState({
    success: null,
    message: "",
  });
  const [showFavoriteStatus, setShowFavoriteStatus] = useState(false);
  const [hasRefreshedFavorites, setHasRefreshedFavorites] = useState(false);
  const location = useLocation();

  const fetchInitialCriticalLevel = async () => {
    try {
      const res = await axios.get("http://localhost:5184/api/Product/Any");
      if (res.data?.criticalStockLevel !== undefined) {
        setCriticalLevel(res.data.criticalStockLevel);
      }
    } catch (err) {
      console.error("Başlangıç kritik seviyesi alınamadı:", err);
    }
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const loadBrands = async () => {
    const data = await getAllBrands();
    setBrands(data);
  };

  const loadSortedProducts = async (username) => {
    const [orderBy, direction] = sortOption.split("_");
    try {
      const res = await axios.get(
        `http://localhost:5184/api/Product/Sorted?orderBy=${orderBy}&direction=${direction}&userId=${username}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Sıralı ürünler yüklenemedi:", err);
    }
  };

  const currentUsername = localStorage.getItem("username"); // Kullanıcı adı
  console.log("currentUsername:", currentUsername);

  useEffect(() => {
    if (currentUsername) {
      loadSortedProducts(currentUsername);
    }
  }, [sortOption, currentUsername]);

  // Sayfa değişince ürünleri tekrar yükle ve flag resetle
  useEffect(() => {
    setHasRefreshedFavorites(false);

    if (currentUsername) {
      loadSortedProducts(currentUsername);
    }
  }, [location.pathname]);

  // ⭐ products state güncellenince yeniden renderı zorla
  useEffect(() => {
    if (showFavoritesIcon && products.length > 0 && !hasRefreshedFavorites) {
      // Mevcut state ile yeni state birebir aynıysa tekrar set etme
      setProducts((prev) => {
        const prevStr = JSON.stringify(prev.map((p) => p.isFavorite));
        const newStr = JSON.stringify(products.map((p) => p.isFavorite));

        if (prevStr === newStr) return prev; // ✅ Değişiklik yoksa set etme
        return [...prev]; // ✅ Re-render tetikle
      });

      setHasRefreshedFavorites(true); // ✅ Sadece 1 kere çalışır
    }
  }, [showFavoritesIcon, products]);

  // 🔹 Giriş yapan kullanıcının ID'si, gerçekte token veya contextten gelecek

  const toggleFavorite = async (id) => {
    // 🔹 Kullanıcı adı boş veya "null" ise uyarı ver, backend'e gitme
    if (!currentUsername || currentUsername.trim().toLowerCase() === "null") {
      setFavoriteStatus({
        success: false,
        message: "Favori eklemek için önce giriş yapın!",
        type: "error",
      });
      setShowFavoriteStatus(true);
      setTimeout(() => setShowFavoriteStatus(false), 1500);
      setTimeout(() => setFavoriteStatus({ success: null, message: "" }), 3000);
      return;
    }

    try {
      // UI'da anlık güncelle
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );

      // Backend'e isteği at
      const res = await axios.put(
        `http://localhost:5184/api/Product/ToggleFavorite/${id}?userId=${currentUsername}`
      );

      // Backend'ten dönen favori durumu
      const isFav = res.data.isFavorite;
      setFavoriteStatus({
        success: true,
        message: isFav
          ? "Ürün favorilere eklendi ⭐"
          : "Ürün favorilerden çıkarıldı ❌",
        type: isFav ? "success" : "warning",
      });
      setShowFavoriteStatus(true);

      // 1.5 sn görünsün, 3 sn'de kaybolsun
      setTimeout(() => setShowFavoriteStatus(false), 1500);
      setTimeout(() => setFavoriteStatus({ success: null, message: "" }), 3000);

      // Listeyi yenile
      loadSortedProducts(currentUsername);
    } catch (error) {
      console.error("Favori durumu değiştirilemedi", error);

      // Backend'ten 400 dönerse kullanıcı yok demektir
      const errorMessage =
        error.response?.status === 400
          ? "Favori işlemi başarısız: Kullanıcı bulunamadı!"
          : "Favori işlemi başarısız!";

      setFavoriteStatus({
        success: false,
        message: errorMessage,
        type: "error",
      });
      setShowFavoriteStatus(true);
      setTimeout(() => setShowFavoriteStatus(false), 1500);
      setTimeout(() => setFavoriteStatus({ success: null, message: "" }), 3000);
    }
  };

  const clearAllFavorites = async () => {
    // 🔹 Kullanıcı adı boş veya "null" ise işlem yapılmaz
    if (!currentUsername || currentUsername.trim().toLowerCase() === "null") {
      setFavoriteStatus({
        success: false,
        message: "Favorileri temizlemek için önce giriş yapın!",
        type: "error",
      });
      setShowFavoriteStatus(true);
      setTimeout(() => setShowFavoriteStatus(false), 1500);
      setTimeout(() => setFavoriteStatus({ success: null, message: "" }), 3000);
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:5184/api/Product/ClearFavorites?userId=${currentUsername}`
      );

      setFavoriteStatus({
        success: res.data.success,
        message: res.data.message,
        type: res.data.success ? "warning" : "info",
      });
      setShowFavoriteStatus(true);

      // 1.5 sn görün, 3 sn sonra kaybol
      setTimeout(() => setShowFavoriteStatus(false), 1500);
      setTimeout(() => setFavoriteStatus({ success: null, message: "" }), 3000);

      // ✅ Listeyi güncelle
      loadSortedProducts(currentUsername);
    } catch (error) {
      console.error("Favoriler silinemedi", error);

      const errorMessage =
        error.response?.status === 400
          ? "Favori temizleme başarısız: Kullanıcı bulunamadı!"
          : "Favoriler silinemedi!";

      setFavoriteStatus({
        success: false,
        message: errorMessage,
        type: "error",
      });
      setShowFavoriteStatus(true);
      setTimeout(() => setShowFavoriteStatus(false), 1500);
      setTimeout(() => setFavoriteStatus({ success: null, message: "" }), 3000);
    }
  };

  useEffect(() => {
    fetchInitialCriticalLevel();
    loadCategories();
    loadBrands();
  }, []);

  useEffect(() => {
    loadSortedProducts();
  }, [sortOption]);

  const rows = products
    .filter((row) => {
      const matchesFilter =
        filterType === "all"
          ? true
          : filterType === "critical"
          ? row.quantity <= criticalLevel
          : filterType === "outofstock"
          ? row.quantity === 0
          : filterType === "favorites"
          ? row.isFavorite // ⭐ Favori ürünler
          : true;

      const matchesSearch = row.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrands.length === 0
          ? true
          : selectedBrands.some(
              (brand) => String(brand.brandId) === String(row.brandId)
            );

      const matchesCategory =
        selectedCategories.length === 0
          ? true
          : selectedCategories.some((cat) => cat.categoryId === row.categoryId);

      return matchesFilter && matchesSearch && matchesBrand && matchesCategory;
    })
    .map((product, index) => ({
      ...product,
      id: product.productId,
    }));

  const getRowClassName = (params) =>
    filterType === "all" && params.row.quantity <= criticalLevel
      ? "critical-row"
      : "";

  const columns = [
    {
      field: "serialNumber",
      headerName: "Sıra No",
      flex: 1,
      Width: 70,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "productId",
      headerName: "ID",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Ürün Adı",
      flex: 2,
      minWidth: 130,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative", // ⭐ Absolute positioning için gerekli
            pl: showFavoritesIcon ? 3 : 0, // ⭐ Yıldız için solda boşluk
            color: "text.primary",
            fontWeight: "bold",
            gap: 1,
          }}
        >
          {/* Ürün Adı */}
          {params.value}

          {/* Yıldız */}
          {showFavoritesIcon && (
            <IconButton
              size="small"
              onClick={() => toggleFavorite(params.row.productId)}
              sx={{
                position: "absolute", // ✅ Kolon genişliğini etkilemez
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                padding: 0,
              }}
            >
              {params.row.isFavorite ? (
                <StarIcon style={{ color: "gold", fontSize: 20 }} />
              ) : (
                <StarBorderIcon style={{ fontSize: 20 }} />
              )}
            </IconButton>
          )}
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Açıklama",
      flex: 2,
      minWidth: 130,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {params.value || <i>Yok</i>}
        </Box>
      ),
    },
    {
      field: "quantity",
      headerName: "Stok",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {params.value}
          {params.row.quantity <= criticalLevel && filterType === "all" && (
            <span style={{ marginLeft: "8px", fontSize: 18 }}>⚠</span>
          )}
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Kategori",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "brand",
      headerName: "Marka",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {params.value || <i>Yok</i>}
        </Box>
      ),
    },
    {
      field: "createdBy",
      headerName: "Ekleyen",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {params.value || <i>Bilinmiyor</i>}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Eklenme Tarihi",
      flex: 2,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ color: "text.primary", fontWeight: "bold" }}>
          {new Date(params.value).toLocaleString("tr-TR")}
        </Box>
      ),
    },
  ];

  // Excel Export
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((p) => ({
        ID: p.productId,
        Ad: p.name,
        Marka: p.brand || "Yok",
        Kategori: p.category || "Yok",
        Stok: p.quantity,
        Açıklama: p.description || "", // ✅ Açıklama sütunu eklendi
        "Eklenme Tarihi": new Date(p.createdAt).toLocaleDateString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ürünler");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `urunler_${Date.now()}.xlsx`);
  };

  // PDF Export (Türkçe karakter destekli)
  const exportToPDF = (data) => {
    const doc = new jsPDF();

    // Özel fontu ekle ve kullan
    doc.addFileToVFS("OpenSans-Light.ttf", myFont);
    doc.addFont("OpenSans-Light.ttf", "OpenSans", "normal");
    doc.setFont("OpenSans");

    doc.text("Ürün Dökümü", 14, 10);

    // ✅ Açıklama sütunu eklendi
    const tableColumn = [
      "ID",
      "Ürün Adı",
      "Marka",
      "Kategori",
      "Stok",
      "Açıklama",
      "Eklenme Tarihi",
    ];
    const tableRows = data.map((p) => [
      p.productId,
      p.name,
      p.brand || "Yok",
      p.category || "Yok",
      p.quantity,
      p.description || "", // ✅ Açıklama ekleniyor
      new Date(p.createdAt).toLocaleDateString("tr-TR"), // Türkçe tarih formatı
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { font: "OpenSans", fontStyle: "normal" }, // Tablo için font
      headStyles: { font: "OpenSans", fontStyle: "normal" }, // Başlıklar için font
      bodyStyles: { font: "OpenSans", fontStyle: "normal" }, // Hücreler için font
      columnStyles: {
        0: { cellWidth: 15, overflow: "linebreak" }, // ID
        1: { cellWidth: 35, overflow: "linebreak" }, // Ad
        2: { cellWidth: 15, overflow: "linebreak" }, // Marka
        3: { cellWidth: 35, overflow: "linebreak" }, // Kategori
        4: { cellWidth: 15, overflow: "linebreak" }, // Stok
        5: { cellWidth: 45, overflow: "linebreak" }, // Açıklama
        6: { cellWidth: 30, overflow: "linebreak" }, // Eklenme Tarihi
      },
      margin: { top: 20, left: 10, right: 10 }, // ✅ Sağ/sol eşit
    });

    doc.save(`urunler_${Date.now()}.pdf`);
  };

  return (
    <Box
      sx={{ width: "100%", maxWidth: "100vw", minHeight: "92vh", m: 0, p: 0 }}
    >
      <style>{criticalRowStyle}</style>

      <Grid container spacing={0} sx={{ width: "100%", m: 0, p: 0 }}>
        <Grid sx={{ width: "100%", mt: 2 }}>
          <Typography
            variant="h5"
            gutterBottom
            color="text.primary"
            fontWeight={700}
          >
            Ürün Listesi
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mb: 2,
              alignItems: "center",
            }}
          >
            {/* Kategori */}
            <div style={{ minWidth: 170, maxWidth: 210 }}>
              <Autocomplete
                multiple
                size="small"
                options={categories
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))}
                getOptionLabel={(option) => option.name}
                value={selectedCategories}
                onChange={(event, value) => setSelectedCategories(value)}
                isOptionEqualToValue={(opt, val) =>
                  opt.categoryId === val.categoryId
                }
                disableCloseOnSelect
                renderTags={() => null}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: 15,
                    borderRadius: 1.5,
                    p: "2px 6px",
                    height: 36,
                    minHeight: 36,
                  },
                  minWidth: 170,
                  maxWidth: 210,
                }}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "background.paper",
                      color: "text.primary",
                    },
                  },
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...otherProps } = props; // key'i ayrı al, diğerlerini spread et
                  return (
                    <li
                      key={key}
                      {...otherProps}
                      style={{
                        color: "text.primary",
                        fontSize: 15,
                      }}
                    >
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kategori"
                    size="small"
                    sx={{
                      input: { color: "text.primary", fontSize: 15 },
                      label: { color: "text.primary", fontSize: 15 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        minHeight: 36,
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* Marka */}
            <div style={{ minWidth: 170, maxWidth: 210 }}>
              <Autocomplete
                multiple
                size="small"
                options={brands
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))}
                getOptionLabel={(option) => option.name}
                value={selectedBrands}
                onChange={(event, value) => setSelectedBrands(value)}
                isOptionEqualToValue={(opt, val) => opt.brandId === val.brandId}
                disableCloseOnSelect
                renderTags={() => null}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: 15,
                    borderRadius: 1.5,
                    p: "2px 6px",
                    height: 36,
                    minHeight: 36,
                  },
                  minWidth: 170,
                  maxWidth: 210,
                }}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "background.paper",
                      color: "text.primary",
                    },
                  },
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...otherProps } = props; // key'i ayır
                  return (
                    <li
                      key={key} // key'i ayrı ver
                      {...otherProps} // diğer props'ları yay
                      style={{
                        fontSize: 15,
                      }}
                    >
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Marka"
                    size="small"
                    sx={{
                      input: { color: "text.primary", fontSize: 15 },
                      label: { color: "text.primary", fontSize: 15 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        minHeight: 36,
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* Filtre */}
            <div style={{ minWidth: 170, maxWidth: 210 }}>
              <Autocomplete
                options={productFilters} // ⭐ Sabit diziyi kaldırdık
                getOptionLabel={(option) => option.name}
                value={
                  productFilters.find((opt) => opt.value === filterType) || null
                }
                onChange={(event, value) => {
                  if (value) setFilterType(value.value);
                }}
                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                disableClearable
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: 15,
                    borderRadius: 1.5,
                    p: "2px 6px",
                    height: 36,
                    minHeight: 36,
                  },
                  minWidth: 170,
                  maxWidth: 210,
                }}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "background.paper",
                      color: "text.primary",
                    },
                  },
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...otherProps } = props;
                  return (
                    <li
                      key={key ?? option.value}
                      {...otherProps}
                      style={{
                        color: "text.primary",
                        fontSize: 15,
                      }}
                    >
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ürünleri Filtrele"
                    size="small"
                    sx={{
                      input: { color: "text.primary", fontSize: 15 },
                      label: { color: "text.primary", fontSize: 15 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        minHeight: 36,
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* Sıralama */}
            <div style={{ minWidth: 170, maxWidth: 210 }}>
              <Autocomplete
                options={[
                  { value: "serialnumber_asc", name: "Sıra No (Artan)" },
                  { value: "serialnumber_desc", name: "Sıra No (Azalan)" },
                  { value: "name_asc", name: "Ad (A-Z)" },
                  { value: "name_desc", name: "Ad (Z-A)" },
                  { value: "quantity_asc", name: "Stok (Artan)" },
                  { value: "quantity_desc", name: "Stok (Azalan)" },
                  { value: "category_asc", name: "Kategori (A-Z)" },
                  { value: "category_desc", name: "Kategori (Z-A)" },
                  { value: "brand_asc", name: "Marka (A-Z)" },
                  { value: "brand_desc", name: "Marka (Z-A)" },
                  { value: "createdAt_desc", name: "Eklenme Tarihi (Azalan)" },
                  { value: "createdAt_asc", name: "Eklenme Tarihi (Artan)" },
                ]}
                getOptionLabel={(option) => option.name}
                value={
                  sortOptionsList.find((opt) => opt.value === sortOption) ||
                  null
                }
                onChange={(event, value) => {
                  if (value) setSortOption(value.value);
                }}
                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                disableClearable
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: 15,

                    borderRadius: 1.5,
                    p: "2px 6px",
                    height: 36,
                    minHeight: 36,
                  },
                  minWidth: 170,
                  maxWidth: 210,
                }}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "background.paper",
                      color: "text.primary",
                    },
                  },
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...otherProps } = props;
                  return (
                    <li
                      key={key ?? option.value} // key ekledik, yoksa option.value kullanılır
                      {...otherProps}
                      style={{
                        color: "text.primary",
                        fontSize: 15,
                      }}
                    >
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sıralama"
                    size="small"
                    sx={{
                      input: { color: "text.primary", fontSize: 15 },
                      label: { color: "text.primary", fontSize: 15 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        minHeight: 36,
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* Arama */}
            <TextField
              label="Ürün Ara"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: 150,
                input: { color: "text.primary" },
                label: { color: "text.primary" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Kritik Seviye */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography color="text.primary" fontWeight={500}>
                Kritik Stok:
              </Typography>
              <TextField
                type="number"
                size="small"
                value={criticalLevel}
                onChange={async (e) => {
                  const value = Number(e.target.value);
                  setCriticalLevel(value);
                  try {
                    await axios.put(
                      `http://localhost:5184/api/Product/UpdateAllCriticalStockLevel/${value}`
                    );
                  } catch (err) {
                    console.error("Kritik stok seviyesi güncellenemedi:", err);
                  }
                }}
                sx={{
                  width: 70,
                  input: { color: "text.primary", textAlign: "center" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                  },
                }}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: "100vw",
              height: { xs: 420, sm: 520, md: 620, lg: 525, xl: 733 },
              overflow: "auto",
              backgroundColor: "background.default",
              borderRadius: 2,
              boxShadow: 2,
              p: 0,
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50, 100]}
              getRowClassName={getRowClassName}
              autoHeight={false}
              localeText={{
                noRowsLabel: "Ürün Bulunamadı",
              }}
              sx={{
                width: "100%",
                height: "100%",
                border: 0,
                backgroundColor: "transparent",
                color: "text.primary",
                fontSize: 16,
                "& .critical-row": criticalRowClass,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "background.paper",
                },
                "& .MuiDataGrid-columnHeader, .MuiDataGrid-footerContainer": {
                  backgroundColor: "background.paper",
                  color: "text.primary",
                  fontWeight: "bold",
                  fontSize: 18,
                  borderRight: "1px solid #4da7db33",
                },
                "& .MuiDataGrid-cell": {
                  color: "text.primary",
                  fontWeight: "bold",
                },
                "& .MuiTablePagination-root, & .MuiTablePagination-toolbar": {
                  color: "text.primary",
                },
              }}
            />
          </Box>

          {/* Export Butonları (Tablo Altında) */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mt: 2,
            }}
          >
            {/* Sol grup: Butonlar + Checkbox */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => exportToExcel(rows)}
              >
                Excel İndir
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => exportToPDF(rows)}
              >
                PDF İndir
              </Button>

              {/* ✅ Butonlara yakın Yıldızları Göster */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showFavoritesIcon}
                    onChange={(e) => setShowFavoritesIcon(e.target.checked)}
                  />
                }
                label="Favoriler"
                sx={{ ml: 1 }} // Butonlara yakınlaştır
              />
            </Box>

            {/* Sağ: Favori Uyarı Mesajı */}
            <Fade in={showFavoriteStatus} timeout={1500}>
              <Alert
                severity={favoriteStatus.type || "info"}
                sx={{
                  maxWidth: 300,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  mb: 0,
                }}
              >
                {favoriteStatus.message}
              </Alert>
            </Fade>
            <Button
              variant="outlined"
              color="error"
              onClick={clearAllFavorites}
            >
              Tüm Favorileri Kaldır
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductList;