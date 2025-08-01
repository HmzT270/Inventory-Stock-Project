import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Fade,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
} from "@mui/material";

const labelSx = {
  color: "text.primary",
  "&.Mui-focused": { color: "text.primary" },
  "&.MuiInputLabel-shrink": { color: "text.primary" },
};

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("user");

  const [status, setStatus] = useState({ success: null, message: "" });
  const [showStatus, setShowStatus] = useState(false);

  const showTemporaryMessage = (isSuccess, msg) => {
    setStatus({ success: isSuccess, message: msg });
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      showTemporaryMessage(false, "Lütfen kullanıcı adı ve parola girin.");
      return;
    }
    if (password !== passwordConfirm) {
      showTemporaryMessage(false, "Parolalar eşleşmiyor.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u) => u.username === username)) {
      showTemporaryMessage(false, "Bu kullanıcı adı zaten mevcut.");
      return;
    }

    const newUser = { username, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Session key işlemi
    const sessionKey = Math.random().toString(36).substring(2);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("sessionKey", sessionKey);
    window.sessionStorage.setItem("activeSessionKey", sessionKey);

    showTemporaryMessage(true, "Kayıt başarılı! Giriş yapılıyor...");
    setTimeout(() => {
      onRegister(role, username);
    }, 1000);
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
        elevation={4}
        sx={{
          width: 360,
          p: 4,
          borderRadius: 3,
          bgcolor: "background.default",
          color: "text.primary",
          boxShadow: 3,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Kayıt Ol
          </Typography>

          <TextField
            label="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: labelSx }}
          />
          <TextField
            type="password"
            label="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: labelSx }}
          />
          <TextField
            type="password"
            label="Parola Tekrar"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: labelSx }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Rol Seçin:
          </Typography>
          <RadioGroup
            row
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="user"
              control={<Radio />}
              label="Kullanıcı"
            />
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          </RadioGroup>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "rgba(68,129,160,0.6)",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { backgroundColor: "rgba(18,93,131,0.7)" },
            }}
          >
            Kayıt Ol
          </Button>

          <Grid sx={{ mt: 2, height: 40 }}>
            <Fade in={showStatus} timeout={1500}>
              <Box sx={{ width: "100%" }}>
                {status.message && (
                  <Alert severity={status.success ? "success" : "error"}>
                    {status.message}
                  </Alert>
                )}
              </Box>
            </Fade>
          </Grid>

          <Typography variant="body2" textAlign="center" mt={3}>
            Zaten üye misiniz?{" "}
            <Button
              variant="text"
              onClick={onSwitchToLogin}
              sx={{ color: "primary.main", textTransform: "none", p: 0 }}
            >
              Giriş Yap
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
