import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  getProductsByCategory,
} from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Grid } from "@mui/material";

const criticalRowClass = {
  backgroundColor: "rgba(199,36,36,0.68) !important",
  color: "#fff",
  fontWeight: "bold",
  animation: "critical-blink 1s linear infinite alternate",
};

const criticalRowStyle = `
@keyframes critical-blink {
  from { background-color: rgba(199,36,36,0.68); }
  to { background-color: rgba(255,59,59,0.96); }
}
`;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [filterType, setFilterType] = useState("all");

  const loadProducts = async () => {
    if (selectedCategory === 0) {
      const all = await getAllProducts();
      setProducts(all);
    } else {
      const filtered = await getProductsByCategory(selectedCategory);
      setProducts(filtered);
    }
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const rows = products.map((product, index) => ({
    ...product,
    id: product.productId,
    serialNumber: index + 1,
    category: product.category || "Bilinmiyor",
  }));

  const filteredRows =
    filterType === "all"
      ? rows
      : filterType === "critical"
      ? rows.filter((row) => row.quantity <= row.criticalStockLevel)
      : rows.filter((row) => row.quantity === 0);

  const getRowClassName = (params) => {
    if (
      filterType === "all" &&
      params.row.quantity <= params.row.criticalStockLevel
    ) {
      return "critical-row";
    }
    return "";
  };

  const columns = [
    {
      field: "serialNumber",
      headerName: "Sıra No",
      flex: 1,
      minWidth: 70,
      renderCell: (params) => (
        <span style={{ color: "#ffffff", fontWeight: "bold" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "productId",
      headerName: "ID",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => (
        <span style={{ color: "#ffffff", fontWeight: "bold" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Ürün Adı",
      flex: 2,
      minWidth: 130,
      renderCell: (params) => (
        <span style={{ color: "#ffffff", fontWeight: "bold" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "description",
      headerName: "Açıklama",
      flex: 2,
      minWidth: 130,
      renderCell: (params) => (
        <span style={{ color: "#ffffff", fontWeight: "bold" }}>
          {params.value || <i>Yok</i>}
        </span>
      ),
    },
    {
      field: "quantity",
      headerName: "Stok",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span style={{ color: "#ffffff", fontWeight: "bold" }}>
          {params.value}
          {params.row.quantity <= params.row.criticalStockLevel &&
            filterType === "all" && (
              <span style={{ marginLeft: "8px", fontSize: 18 }}>⚠</span>
            )}
        </span>
      ),
    },
    {
      field: "category",
      headerName: "Kategori",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span style={{ color: "#ffffff", fontWeight: "bold" }}>
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        minHeight: "92vh",
        m: 0,
        p: 0,
        overflow: "hidden",
        background: "none",
      }}
    >
      <style>{criticalRowStyle}</style>

      <Grid container spacing={0} sx={{ width: "100%", m: 0, p: 0 }}>
        <Grid sx={{ width: "100%", m: 0, p: 0, mt: 5 }}>
          <Typography variant="h5" gutterBottom color="#fff" fontWeight={700}>
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
            <div>
              <label style={{ fontWeight: 500, color: "#fff" }}>
                Kategori Filtrele:{" "}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                style={{
                  padding: 4,
                  fontSize: 15,
                  marginLeft: 8,
                  color: "#fff",
                  backgroundColor: "rgba(89, 146, 203, 0.14)",
                  borderRadius: 4,
                  border: "none",
                  fontWeight: 600,
                  minWidth: 160,
                  outline: "none",
                  boxShadow: "0 0 8px rgba(0,0,0,0.10)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <option
                  value={0}
                  style={{ background: "#5992cb", fontWeight: 600 }}
                >
                  Tüm Kategoriler
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.categoryId}
                    value={cat.categoryId}
                    style={{ background: "#5992cbff", fontWeight: 600 }}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 500, color: "#fff" }}>
                Ürünleri Filtrele:{" "}
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: 4,
                  fontSize: 15,
                  marginLeft: 8,
                  color: "#fff",
                  backgroundColor: "rgba(89, 146, 203, 0.14)",
                  borderRadius: 4,
                  border: "none",
                  fontWeight: 600,
                  minWidth: 190,
                  outline: "none",
                  boxShadow: "0 0 8px rgba(0,0,0,0.10)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <option
                  value="all"
                  style={{ background: "#5992cb", fontWeight: 600 }}
                >
                  Tüm Ürünler
                </option>
                <option
                  value="critical"
                  style={{ background: "#5992cb", fontWeight: 600 }}
                >
                  Kritik Stoktaki Ürünler
                </option>
                <option
                  value="outofstock"
                  style={{ background: "#5992cb", fontWeight: 600 }}
                >
                  Stokta Olmayan Ürünler
                </option>
              </select>
            </div>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: "100vw",
              height: { xs: 420, sm: 520, md: 620, lg: 525, xl: 733 },
              overflow: "auto",
              background: "rgba(16,132,199,0.07)",
              borderRadius: 2,
              boxShadow: 2,
              p: 0,
              m: 0,
            }}
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50, 100]}
              getRowClassName={getRowClassName}
              autoHeight={false}
              sx={{
                width: "100%",
                height: "100%",
                border: 0,
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: 16,
                "& .critical-row": criticalRowClass,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#21598b",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#6baee8ff",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                  borderRight: "1px solid #4da7db33",
                },
                "& .MuiDataGrid-cell": {
                  color: "#fff",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row:not(.critical-row):hover": {
                  backgroundColor: "rgba(32, 158, 255, 0) !important",
                },
                "& .Mui-selected, & .Mui-selected:hover": {
                  backgroundColor: "#1d5fae !important",
                  color: "#fff",
                },
                "& .MuiTablePagination-root, & .MuiTablePagination-toolbar, & .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel, & .MuiTablePagination-select, & .MuiTablePagination-actions":
                  {
                    color: "#fff",
                  },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductList;
