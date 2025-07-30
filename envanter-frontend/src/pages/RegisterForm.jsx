import React, { useState } from "react";

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Lütfen kullanıcı adı ve parola girin.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Parolalar eşleşmiyor.");
      return;
    }

    // Kullanıcıları localStorage'da dizi olarak tutuyoruz
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.username === username)) {
      setError("Bu kullanıcı adı zaten mevcut.");
      return;
    }
    const newUser = { username, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Otomatik giriş ve SESSION KEY
    const sessionKey = Math.random().toString(36).substring(2);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("sessionKey", sessionKey);
    window.sessionStorage.setItem("activeSessionKey", sessionKey);

    onRegister(role, username);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Kayıt Ol</h2>
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
      <input
        type="password"
        placeholder="Parola Tekrar"
        value={passwordConfirm}
        onChange={e => setPasswordConfirm(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <div style={{ marginBottom: 10 }}>
        <label style={{ marginRight: 10 }}>
          <input
            type="radio"
            value="user"
            checked={role === "user"}
            onChange={() => setRole("user")}
          /> Kullanıcı
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={role === "admin"}
            onChange={() => setRole("admin")}
          /> Admin
        </label>
      </div>
      <button type="submit" style={{ width: "100%", padding: 10 }}>Kayıt Ol</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: 15 }}>
        Zaten üye misiniz?{" "}
        <button type="button" onClick={onSwitchToLogin} style={{ color: "blue", cursor: "pointer", border: "none", background: "none", padding: 0 }}>
          Giriş Yap
        </button>
      </p>
    </form>
  );
}
