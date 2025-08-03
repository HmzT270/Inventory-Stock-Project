import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function LoginForm({
  onLogin,
  onSwitchToRegister,
  onSwitchToChangePassword,
  onSwitchToForgotPassword,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,20}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setError("❌ Kullanıcı adı veya parola yanlış!");
      return;
    }

    // ✅ Şifre karmaşıklık kontrolü
    if (!passwordRegex.test(password)) {
      setError(
        "❌ Parola 6-20 karakter olmalı, en az 1 büyük, 1 küçük, 1 rakam ve 1 özel karakter içermeli!"
      );
      return;
    }

    // ✅ Kullanıcıyı LocalStorage'a kaydet
    localStorage.setItem("username", user.username);

    // SESSION KEY işlemi
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
        justifyContent: "center",
        alignItems: "flex-start",
        pt: "10vh",
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
          autoComplete="off"
        />

        <TextField
          label="Parola"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
        />

        <Button type="submit" variant="contained" fullWidth>
          GİRİŞ
        </Button>

        {error && (
          <Typography color="error" textAlign="center" fontSize={14}>
            {error}
          </Typography>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Üye Olmak İçin:{" "}
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

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Şifrenizi Değiştirmek İçin:{" "}
          <Button
            type="button"
            onClick={onSwitchToChangePassword}
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textTransform: "none",
              p: 0,
            }}
          >
            Şifre Değiştir
          </Button>
        </Typography>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Şifre Sıfırlamak İçin:{" "}
          <Button
            type="button"
            onClick={onSwitchToForgotPassword}
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textTransform: "none",
              p: 0,
            }}
          >
            Şifremi Unuttum
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
