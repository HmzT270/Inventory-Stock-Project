import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, LinearProgress } from "@mui/material";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,20}$/;

  // Şifre gücünü hesapla
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 6) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;
    return score;
  };

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!username || !newPassword || !confirmPassword || !securityAnswer) {
      setMessage("❌ Tüm alanları doldurun!");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "❌ Şifre 6-20 karakter olmalı, en az 1 büyük, 1 küçük, 1 rakam ve 1 özel karakter içermeli!"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Şifreler uyuşmuyor!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.username === username);

    if (userIndex === -1) {
      setMessage("❌ Bu kullanıcı bulunamadı!");
      return;
    }

    // Güvenlik sorusu kontrolü
    if (users[userIndex].securityAnswer !== securityAnswer) {
      setMessage("❌ Güvenlik sorusu cevabı yanlış!");
      return;
    }

    // Şifreyi güncelle
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    setMessage("✅ Şifre başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  // Bar rengi
  const getBarColor = () => {
    if (passwordStrength < 50) return "error";
    if (passwordStrength < 75) return "warning";
    return "success";
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
        onSubmit={handleResetPassword}
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
          Şifremi Unuttum
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

        <Box>
          <TextField
            label="Yeni Şifre"
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            fullWidth
            autoComplete="new-password"
          />
          {newPassword && (
            <LinearProgress
              variant="determinate"
              value={passwordStrength}
              color={getBarColor()}
              sx={{ height: 8, borderRadius: 5, mt: 1 }}
            />
          )}
        </Box>

        <TextField
          label="Yeni Şifre (Tekrar)"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
        />

        <Button type="submit" variant="contained" fullWidth>
          Şifreyi Sıfırla
        </Button>

        <Typography
          fontSize={12}
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 1 }}
        >
          6-20 karakter, en az 1 büyük, 1 küçük, 1 rakam ve 1 özel karakter
        </Typography>

        {message && (
          <Typography
            color={message.startsWith("✅") ? "green" : "error"}
            textAlign="center"
            fontSize={14}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}