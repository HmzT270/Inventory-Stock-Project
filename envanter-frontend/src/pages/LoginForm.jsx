import React, { useState } from "react";

export default function LoginForm({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      setError("Kullanıcı adı veya parola yanlış!");
      return;
    }

    // SESSION KEY işlemi (her sekme ayrı sessionKey alacak)
    const sessionKey = Math.random().toString(36).substring(2);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("sessionKey", sessionKey);
    window.sessionStorage.setItem("activeSessionKey", sessionKey);

    onLogin(user.role, user.username);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Giriş Yap</h2>
      <input
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Parola"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <button type="submit" style={{ width: "100%", padding: 10 }}>Giriş</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: 15 }}>
        Üye değil misiniz?{" "}
        <button type="button" onClick={onSwitchToRegister} style={{ color: "blue", cursor: "pointer", border: "none", background: "none", padding: 0 }}>
          Kayıt Ol
        </button>
      </p>
    </form>
  );
}
