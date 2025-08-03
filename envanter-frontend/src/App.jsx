import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductManagement from "./pages/ProductManagement";
import ProductEdit from "./pages/ProductEdit";
import CategoryEdit from "./pages/CategoryEdit";
import BrandEdit from "./pages/BrandEdit";
import StockMovements from "./pages/StockMovements";
import DeletedProductsTable from "./pages/DeletedProductsTable";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword"; // ✅ Şifremi Unuttum eklendi

import { ThemeContextProvider, useThemeContext } from "./components/ThemeContext";

function AppContent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const [sessionError, setSessionError] = useState(false);

  const { darkMode, toggleTheme } = useThemeContext();

  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem("currentUser");
      const sessionKey = localStorage.getItem("sessionKey");
      if (
        loggedIn &&
        (storedUser === null ||
          sessionKey !== window.sessionStorage.getItem("activeSessionKey"))
      ) {
        setSessionError(true);
        setLoggedIn(false);
        setUserRole(null);
        setUsername("");
      }
    };
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  const handleLogout = () => {
    setLoggedIn(false);
    setUserRole(null);
    setUsername("");
  };

  if (sessionError) {
    return (
      <div style={{ color: "red", fontSize: 20, textAlign: "center", marginTop: 50 }}>
        Bu hesaptan çıkış yaptınız veya başka bir sekmede farklı bir hesapla giriş yapıldı!
        <br />
        <button onClick={() => (window.location.href = "/login")}>Yeniden Giriş Yap</button>
      </div>
    );
  }

  return (
    <Router>
      {/* Sağ üstte Dark/Light butonu */}
      <Box position="fixed" top={10} right={10} zIndex={1500}>
        <IconButton onClick={toggleTheme} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/" />
            ) : (
              <LoginForm
                onLogin={(role, username) => {
                  setUserRole(role);
                  setUsername(username);
                  setLoggedIn(true);
                }}
                onSwitchToRegister={() => (window.location.href = "/register")}
                onSwitchToChangePassword={() => (window.location.href = "/change-password")}
                onSwitchToForgotPassword={() => (window.location.href = "/forgot-password")} // ✅ Eklendi
              />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            loggedIn ? (
              <Navigate to="/" />
            ) : (
              <RegisterForm
                onRegister={(role, username) => {
                  setUserRole(role);
                  setUsername(username);
                  setLoggedIn(true);
                }}
                onSwitchToLogin={() => (window.location.href = "/login")}
              />
            )
          }
        />

        {/* Change Password */}
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={
            loggedIn ? (
              <Navigate to="/" />
            ) : (
              <ForgotPassword /> // ✅ Yeni eklenen sayfa
            )
          }
        />

        {/* Kullanıcı veya Admin için ortak layout */}
        {loggedIn && (
          <Route
            path="/*"
            element={
              <Sidebar role={userRole} username={username} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  {userRole === "admin" && (
                    <>
                      <Route path="/product-management" element={<ProductManagement />} />
                      <Route path="/rename-product" element={<ProductEdit />} />
                      <Route path="/deleted-products" element={<DeletedProductsTable />} />
                      <Route path="/kategori-duzenle" element={<CategoryEdit />} />
                      <Route path="/marka-duzenle" element={<BrandEdit />} />
                      <Route path="/stock" element={<StockMovements />} />
                    </>
                  )}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Sidebar>
            }
          />
        )}

        {!loggedIn && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}
