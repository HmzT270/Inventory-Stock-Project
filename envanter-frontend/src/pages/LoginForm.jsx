import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";

export default function LoginForm({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setError("Kullanıcı adı veya parola yanlış!");
      return;
    }

    // ✅ Kullanıcı adını LocalStorage'a kaydet
    localStorage.setItem("username", user.username);

    // SESSION KEY işlemi (her sekme ayrı sessionKey alacak)
    const sessionKey = Math.random().toString(36).substring(2);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("sessionKey", sessionKey);
    window.sessionStorage.setItem("activeSessionKey", sessionKey);

    // ✅ Login callback
    onLogin(user.role, user.username);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",   // yatay ortalama
        alignItems: "flex-start",    // üste hizalama
        pt: "10vh",                  // yukarıdan boşluk
        bgcolor: "background.default",
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 350,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" align="center" fontWeight={700}>
          Giriş Yap
        </Typography>

        <TextField
          label="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />

        <TextField
          label="Parola"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        <Button type="submit" variant="contained" fullWidth>
          GİRİŞ
        </Button>

        {error && (
          <Typography color="error" textAlign="center" fontSize={14}>
            {error}
          </Typography>
        )}

        <Typography variant="body2" align="center">
          Üye değil misiniz?{" "}
          <Button
            type="button"
            onClick={onSwitchToRegister}
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textTransform: "none",
              p: 0,
            }}
          >
            Kayıt Ol
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
