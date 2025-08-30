import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function ChangePassword() {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [status, setStatus] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,20}$/;

  // Şifre gücü hesaplama
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  };

  const strength = calculatePasswordStrength(newPassword);
  const strengthColors = ["#d32f2f", "#f57c00", "#fbc02d", "#388e3c"];
  const strengthTexts = ["Çok Zayıf", "Zayıf", "Orta", "Güçlü"];

  // Kullanıcı adını yazınca güvenlik sorusunu getir
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.username === value);

    if (user) {
      switch (user.securityQuestion) {
        case "pet":
          setSecurityQuestion("İlk evcil hayvanınızın adı nedir?");
          break;
        case "teacher":
          setSecurityQuestion("İlkokul öğretmeninizin adı nedir?");
          break;
        case "city":
          setSecurityQuestion("Doğduğunuz şehir neresi?");
          break;
        case "food":
          setSecurityQuestion("Çocukken en sevdiğiniz yemek neydi?");
          break;
        case "friend":
          setSecurityQuestion("En iyi çocukluk arkadaşınızın adı nedir?");
          break;
        default:
          setSecurityQuestion("");
      }
    } else {
      setSecurityQuestion("");
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!username || !oldPassword || !newPassword || !securityAnswer) {
      setStatus("Tüm alanlari doldurun!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.username === username);

    if (!user) {
      setStatus("Kullanici adi yanliş!");
      return;
    }

    if (user.password !== oldPassword) {
      setStatus("Eski şifre yanliş!");
      return;
    }

    if (user.securityAnswer !== securityAnswer) {
      setStatus("Güvenlik sorusu cevabi yanliş!");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setStatus("Yeni şifre kriterleri karşilanmiyor!");
      return;
    }

    // Şifreyi güncelle
    user.password = newPassword;
    const updatedUsers = users.map((u) =>
      u.username === username ? user : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setStatus(
      "Şifre başariyla değiştirildi! 1.5 sn sonra giriş sayfasina yönlendiriliyorsunuz..."
    );

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
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
        onSubmit={handleChangePassword}
        autoComplete="off"
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
          Şifre Değiştir
        </Typography>

        <TextField
          label="Kullanıcı Adı"
          value={username}
          onChange={handleUsernameChange}
          fullWidth
          autoComplete="off"
        />

        {securityQuestion && (
          <>
            <Typography fontSize={14} color="text.secondary">
              {securityQuestion}
            </Typography>
            <TextField
              label="Cevabınız"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              fullWidth
              autoComplete="off"
            />
          </>
        )}

        <TextField
          label="Eski Şifre"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          autoComplete="current-password"
        />

        <TextField
          label="Yeni Şifre"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
        />

        {/* Animasyonlu Şifre Güç Çubuğu */}
        {newPassword && (
          <Box>
            <Box
              sx={{
                height: 8,
                width: "100%",
                backgroundColor: "#e0e0e0",
                borderRadius: 3,
                overflow: "hidden",
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${(strength / 4) * 100}%`,
                  backgroundColor: strengthColors[strength - 1] || "#d32f2f",
                  transition: "width 0.4s ease, background-color 0.4s ease",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: strengthColors[strength - 1] || "#d32f2f",
                transition: "color 0.4s ease",
              }}
            >
              {strengthTexts[strength - 1] || "Çok Zayıf"}
            </Typography>
          </Box>
        )}

        <Button type="submit" variant="contained" fullWidth>
          Şifreyi Değiştir
        </Button>

        {/* Şifre Kuralı Yazısı Butonun Altında */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "text.secondary",
            textAlign: "center",
            mt: 1,
          }}
        >
          Şifre 6-20 karakter olmalı, en az 1 büyük, 1 küçük, 1 rakam ve 1 özel karakter içermeli.
        </Typography>

        {status && (
          <Typography
            color={status.startsWith("✅") ? "green" : "error"}
            textAlign="center"
            fontSize={14}
          >
            {status}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}