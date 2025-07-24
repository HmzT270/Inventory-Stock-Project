import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Home,
  Inventory,
  AddBox,
  Layers,
  Edit,
  DeleteOutline,
  Menu as MenuIcon,
  Info,
  Category,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const DRAWER_WIDTH = 260;

export default function Sidebar({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { to: "/", icon: <Home />, label: "Ana Sayfa" },
    { to: "/products", icon: <Inventory />, label: "Ürünler" },
    {
      to: "/deleted-products",
      icon: <DeleteOutline />,
      label: "Silinen Ürünler",
    },
    { to: "/product-management", icon: <AddBox />, label: "Ürün Ekle/Sil" },
    { to: "/rename-product", icon: <Edit />, label: "Ürün Düzenle" },
    { to: "/kategori-duzenle", icon: <Category />, label: "Kategori Düzenle" },
    { to: "/stock", icon: <Layers />, label: "Stok Yönetimi" },
  ];

  const hamburgerIconButtonSx = {
    color: "#fff",
    p: "2px",
    ml: 0.2,
    width: 24,
    height: 24,
    minWidth: 0,
    minHeight: 0,
  };
  const hamburgerIconSx = { fontSize: 18 };

  const drawerContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        color: "#fff",
        overflowX: "hidden",
      }}
      role="presentation"
      onClick={isMobile ? () => setDrawerOpen(false) : undefined}
    >
      <List sx={{ p: 0 }}>
        <ListItem
          sx={{
            py: 2,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 0.5,
          }}
        >
          <ListItemText
            primary="Envanter Sistemi"
            primaryTypographyProps={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: 19,
            }}
            sx={{ m: 0, flex: 1, minWidth: 0 }}
          />
          {isMobile && drawerOpen && (
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={hamburgerIconButtonSx}
            >
              <MenuIcon sx={hamburgerIconSx} />
            </IconButton>
          )}
        </ListItem>

        {menuItems.map(({ to, icon, label }) => (
          <ListItem
            component={Link}
            to={to}
            key={to}
            sx={{
              "& .MuiListItemText-primary": {
                padding: "10px 16px",
                borderRadius: "15px",
                transition:
                  "background-color 0.6s ease, color 0.6s ease, transform 0.3s ease",
                display: "inline-block",
                minWidth: 120,
                textAlign: "center",
                lineHeight: "24px",
                backgroundColor: "transparent",
                color: "#fff",
                whiteSpace: "nowrap",
                transformOrigin: "center",
              },
              "&:hover .MuiListItemText-primary": {
                backgroundColor: "white",
                color: "#181818",
                transform: "scale(1.2)",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{icon}</ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ color: "#fff" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {isMobile && !drawerOpen && (
        <IconButton
          color="inherit"
          aria-label="menu"
          edge="start"
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            zIndex: 2001,
            backgroundColor: "#181818d0",
            "&:hover": { backgroundColor: "#181818" },
            ...hamburgerIconButtonSx,
          }}
        >
          <MenuIcon sx={hamburgerIconSx} />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: isMobile
            ? {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                backgroundColor: "#181818",
                color: "#fff",
                overflowX: "hidden",
                position: "fixed",
                left: 0,
                top: 0,
                height: "100%",
              }
            : {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                background: "#18181805",
                color: "#fff",
                overflowX: "hidden",
              },
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: {
            xs: 0,
            sm: 0,
            md: 0,
          },
          p: { xs: 2, md: 3 },
          minHeight: "100vh",
          boxSizing: "border-box",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
