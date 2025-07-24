import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import WarningIcon from "@mui/icons-material/WarningAmber";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";

export default function Home() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
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
        alignItems: "flex-start",
        justifyContent: "center",
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          mx: "auto",
          px: { xs: 1, md: 2 },
        }}
      >
        <Typography
          variant="h4"
          color="#fff"
          fontWeight={700}
          gutterBottom
          textAlign="center"
        >
          Hoş geldiniz!
        </Typography>
        <Typography color="#fff" fontSize={18} mb={3} textAlign="center">
          Envanter ve stok takibinizi kolayca yönetin.
        </Typography>

        {/* Sayaç Kartları */}
        <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4, mx: -1 }}>
          {[
            {
              icon: <InventoryIcon fontSize="large" />,
              label: "Toplam Ürün",
              value: productCount,
              bg: "#15366b",
            },
            {
              icon: <CategoryIcon fontSize="large" />,
              label: "Kategori",
              value: categoryCount,
              bg: "#21598b",
            },
            {
              icon: <WarningIcon fontSize="large" />,
              label: "Kritik Stok",
              value: criticalCount,
              bg: "#99262d",
            },
            {
              icon: <BlockIcon fontSize="large" />,
              label: "Stokta Yok",
              value: outOfStockCount,
              bg: "#d32f2f",
            },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                width: {
                  xs: "50%",
                  sm: "50%",
                  md: "25%",
                },
                boxSizing: "border-box",
                px: 0.5,
                mb: 1,
              }}
            >
              <Card
                sx={{
                  bgcolor: item.bg,
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 2,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {item.icon}
                    <Box>
                      <Typography fontWeight={700} fontSize={18}>
                        {item.value}
                      </Typography>
                      <Typography fontSize={15}>{item.label}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Son Eklenen Ürün */}
        {lastProduct && (
          <Box
            sx={{
              mt: 4,
              backgroundColor: "rgba(16, 132, 199, 0)",
              borderRadius: 2,
              p: 3,
              color: "#fff",
              boxShadow: 2,
              mb: 3,
              width: "100%",
              maxWidth: 650,
              mx: "auto",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Typography fontWeight={800} fontSize={22}>
                Son Eklenen Ürün
              </Typography>
              <AddCircleOutlineIcon sx={{ fontSize: 28 }} />
            </Stack>
            <Typography sx={{ lineHeight: 2 }}>
              <b>Ürün Adı:</b> {lastProduct.name} <br />
              <b>Stok:</b> {lastProduct.quantity} <br />
              <b>Kategori:</b> {lastProduct.category || "Bilinmiyor"} <br />
              <b>Açıklama:</b> {lastProduct.description?.trim() || "Yok"} <br />
              <b>Eklenme Tarihi:</b>{" "}
              {new Date(lastProduct.createdAt).toLocaleString("tr-TR")}
            </Typography>
          </Box>
        )}

        {/* Son Silinen Ürün */}
        <Box
          sx={{
            mt: 0,
            backgroundColor: "rgba(16, 132, 199, 0)",
            borderRadius: 2,
            p: 3,
            color: "#fff",
            boxShadow: 2,
            width: "100%",
            maxWidth: 650,
            mx: "auto",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Typography fontWeight={800} fontSize={22}>
              Son Silinen Ürün
            </Typography>
            <DeleteOutlineIcon sx={{ fontSize: 28 }} />
          </Stack>
          {lastDeleted ? (
            <Typography sx={{ lineHeight: 2 }}>
              <b>Ürün Adı:</b> {lastDeleted.name} <br />
              <b>Stok:</b> {lastDeleted.quantity} <br />
              <b>Kategori:</b>{" "}
              {lastDeleted.categoryName ||
                lastDeleted.CategoryId ||
                "Bilinmiyor"}{" "}
              <br />
              <b>Açıklama:</b> {lastDeleted.description?.trim() || "Yok"} <br />
              <b>Silinme Tarihi:</b>{" "}
              {lastDeleted.deletedAt
                ? new Date(lastDeleted.deletedAt).toLocaleString("tr-TR")
                : ""}
            </Typography>
          ) : (
            <Typography sx={{ lineHeight: 2, fontStyle: "italic" }}>
              Henüz silinen ürün yok.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
