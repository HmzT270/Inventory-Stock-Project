import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const [sessionError, setSessionError] = useState(false);

  // Oturumu sekmeler arası takip et!
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

  if (sessionError) {
    return (
      <div style={{ color: "red", fontSize: 20, textAlign: "center", marginTop: 50 }}>
        Bu hesaptan çıkış yaptınız veya başka bir sekmede farklı bir hesapla giriş yapıldı!
        <br />
        <button onClick={() => window.location.reload()}>Yeniden Giriş Yap</button>
      </div>
    );
  }

  if (!loggedIn) {
    return showRegister ? (
      <RegisterForm
        onRegister={(role, username) => {
          setUserRole(role);
          setUsername(username);
          setLoggedIn(true);
          setShowRegister(false);
        }}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginForm
        onLogin={(role, username) => {
          setUserRole(role);
          setUsername(username);
          setLoggedIn(true);
        }}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  if (userRole === "user") {
    return (
      <Router>
        <Sidebar role={userRole} username={username}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </Sidebar>
      </Router>
    );
  }

  // Admin
  return (
    <Router>
      <Sidebar role={userRole} username={username}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/rename-product" element={<ProductEdit />} />
          <Route path="/deleted-products" element={<DeletedProductsTable />} />
          <Route path="/kategori-duzenle" element={<CategoryEdit />} />
          <Route path="/marka-duzenle" element={<BrandEdit />} />
          <Route path="/stock" element={<StockMovements />} />
        </Routes>
      </Sidebar>
    </Router>
  );
}
