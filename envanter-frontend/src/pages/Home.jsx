import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import WarningIcon from "@mui/icons-material/WarningAmber";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StoreIcon from "@mui/icons-material/Store";
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { getAllBrands } from "../services/brandService";

export default function Home() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [lastProduct, setLastProduct] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const products = await getAllProducts();
      setProductCount(products.length);
      setCriticalCount(
        products.filter((p) => p.quantity <= p.criticalStockLevel).length
      );
      setOutOfStockCount(products.filter((p) => p.quantity === 0).length);
      setLastProduct(
        products.length > 0
          ? products
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
          : null
      );

      const categories = await getAllCategories();
      setCategoryCount(categories.length);

      const brands = await getAllBrands();
      setBrandCount(brands.length);

      try {
        const res = await fetch(
          "http://localhost:5184/api/Product/Last10Deleted"
        );
        if (res.ok) {
          const data = await res.json();
          const sorted = data.sort(
            (a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)
          );
          setLastDeleted(sorted[0] || null);
        } else {
          setLastDeleted(null);
        }
      } catch {
        setLastDeleted(null);
      }
    }

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: { xs: 1, md: 3 },
        }}
      >
        <Typography
          variant="h4"
          color="text.primary"
          fontWeight={700}
          gutterBottom
          textAlign="center"
        >
          Hoş geldiniz!
        </Typography>
        <Typography color="text.primary" fontSize={18} mb={3} textAlign="center">
          Envanter ve stok takibinizi kolayca yönetin.
        </Typography>

        {/* Sayaç Kartları */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          {[
            {
              icon: <InventoryIcon fontSize="large" />,
              label: "Toplam Ürün",
              value: productCount,
              bg: "background.paper",
            },
            {
              icon: <CategoryIcon fontSize="large" />,
              label: "Kategori",
              value: categoryCount,
              bg: "background.paper",
            },
            {
              icon: <StoreIcon fontSize="large" />,
              label: "Marka",
              value: brandCount,
              bg: "background.paper",
            },
            {
              icon: <WarningIcon fontSize="large" />,
              label: "Kritik Stok",
              value: criticalCount,
              bg: "background.paper",
            },
            {
              icon: <BlockIcon fontSize="large" />,
              label: "Stokta Yok",
              value: outOfStockCount,
              bg: "background.paper",
            },
          ].map((item, i) => (
            <Card
              key={i}
              sx={{
                bgcolor: item.bg,
                color: "text.primary",
                borderRadius: 3,
                boxShadow: 2,
                width: { xs: "48%", sm: "30%", md: "18%" },
                minWidth: 150,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  {item.icon}
                  <Box>
                    <Typography fontWeight={700} fontSize={18} color="text.primary">
                      {item.value}
                    </Typography>
                    <Typography fontSize={15} color="text.primary">
                      {item.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Son Eklenen ve Son Silinen Ürün Kartları */}
        {(lastProduct || lastDeleted) && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mt: 4,
              mb: 3,
            }}
          >
            {lastProduct && (
              <Box
                sx={{
                  flex: "1 1 300px",
                  maxWidth: 600,
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  p: 3,
                  color: "text.primary",
                  boxShadow: 2,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Typography fontWeight={800} fontSize={22} color="text.primary">
                    Son Eklenen Ürün
                  </Typography>
                  <AddCircleOutlineIcon sx={{ fontSize: 28 }} />
                </Stack>
                <Typography sx={{ lineHeight: 2 }} color="text.primary">
                  <b>Ürün Adı:</b> {lastProduct.name} <br />
                  <b>Stok:</b> {lastProduct.quantity} <br />
                  <b>Kategori:</b> {lastProduct.category || "Bilinmiyor"} <br />
                  <b>Marka:</b> {lastProduct.brand || "Bilinmiyor"} <br />
                  <b>Açıklama:</b>{" "}
                  {lastProduct.description?.trim() || "Yok"} <br />
                  <b>Eklenme Tarihi:</b>{" "}
                  {new Date(lastProduct.createdAt).toLocaleString("tr-TR")} <br />
                  <b>Ekleyen:</b> {lastProduct.createdBy || "Bilinmiyor"}
                </Typography>
              </Box>
            )}

            {lastDeleted && (
              <Box
                sx={{
                  flex: "1 1 300px",
                  maxWidth: 600,
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  p: 3,
                  color: "text.primary",
                  boxShadow: 2,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Typography fontWeight={800} fontSize={22} color="text.primary">
                    Son Silinen Ürün
                  </Typography>
                  <DeleteOutlineIcon sx={{ fontSize: 28 }} />
                </Stack>
                <Typography sx={{ lineHeight: 2 }} color="text.primary">
                  <b>Ürün Adı:</b> {lastDeleted.name} <br />
                  <b>Stok:</b> {lastDeleted.quantity} <br />
                  <b>Kategori:</b>{" "}
                  {lastDeleted.categoryName ||
                    lastDeleted.CategoryId ||
                    "Bilinmiyor"}{" "}
                  <br />
                  <b>Marka:</b> {lastDeleted.brand || "Bilinmiyor"} <br />
                  <b>Açıklama:</b>{" "}
                  {lastDeleted.description?.trim() || "Yok"} <br />
                  <b>Silinme Tarihi:</b>{" "}
                  {lastDeleted.deletedAt
                    ? new Date(lastDeleted.deletedAt).toLocaleString("tr-TR")
                    : ""} <br />
                  <b>Silen:</b> {lastDeleted.deletedBy || "Bilinmiyor"}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
