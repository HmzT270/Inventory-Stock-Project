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
  Typography,
  Button,
} from "@mui/material";
import {
  Home,
  Inventory,
  AddBox,
  Layers,
  Edit,
  DeleteOutline,
  Menu as MenuIcon,
  Category,
} from "@mui/icons-material";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import { Link, useNavigate } from "react-router-dom";
import { useThemeContext } from "../components/ThemeContext";

const DRAWER_WIDTH = 260;

export default function Sidebar({ children, role, username, onLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { darkMode } = useThemeContext();

  const menuItems = [
    { to: "/", icon: <Home />, label: "Ana Sayfa", always: true },
    { to: "/products", icon: <Inventory />, label: "Ürünler", always: true },
    { to: "/deleted-products", icon: <DeleteOutline />, label: "Silinen Ürünler", admin: true },
    { to: "/product-management", icon: <AddBox />, label: "Ürün Ekle/Sil", admin: true },
    { to: "/rename-product", icon: <Edit />, label: "Ürün Düzenle", admin: true },
    { to: "/kategori-duzenle", icon: <Category />, label: "Kategori Düzenle", admin: true },
    { to: "/marka-duzenle", icon: <BrandingWatermarkIcon />, label: "Marka Düzenle", admin: true },
    { to: "/stock", icon: <Layers />, label: "Stok Yönetimi", admin: true },
  ];

  const hamburgerIconButtonSx = {
    color: theme.palette.text.primary,
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
        color: theme.palette.text.primary,
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        whiteSpace: "nowrap", // Scroll engelle
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
              color: theme.palette.text.primary,
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

        {menuItems.map(({ to, icon, label, always, admin }) => {
          const isAdminOnly = admin && role !== "admin";
          return (
            <ListItem
              component={isAdminOnly ? "div" : Link}
              to={isAdminOnly ? undefined : to}
              key={to}
              sx={{
                opacity: isAdminOnly ? 0.4 : 1,
                pointerEvents: isAdminOnly ? "none" : "auto",
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
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                  transformOrigin: "center",
                },
                "&:hover .MuiListItemText-primary": !isAdminOnly && {
                  backgroundColor: darkMode ? "#fff" : "#000",
                  color: darkMode ? "#000" : "#fff",
                  transform: "scale(1.2)",
                  borderRadius: "15px",
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ color: theme.palette.text.primary }}
              />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flex: 1 }} />
      <Box sx={{ p: 2, pb: 3 }}>
        <Typography sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}>
          {username ? `Giriş yapan: ${username}` : ""}
        </Typography>
        <Button
          onClick={() => {
            if (onLogout) onLogout();
            navigate("/login");
          }}
          variant="outlined"
          color="inherit"
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: darkMode ? "#234872" : "#d0e0f0",
              borderColor: theme.palette.text.secondary,
            },
            fontWeight: 600,
            width: "100%",
          }}
        >
          Çıkış Yap
        </Button>
      </Box>
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
            backgroundColor: darkMode ? "#181818d0" : "#f5f5f5d0",
            "&:hover": {
              backgroundColor: darkMode ? "#181818" : "#f5f5f5",
            },
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
          sx: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
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
          ml: { xs: 0, sm: 0, md: 0 },
          p: { xs: 2, md: 3 },
          minHeight: "100vh",
          boxSizing: "border-box",
          overflowY: "auto",
          overflowX: "hidden",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
