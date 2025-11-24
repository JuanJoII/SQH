// src/components/LoginForm.jsx
import { useState } from "react";
import api from "../api/client";
import { useNavigate, Link } from "react-router-dom";  // ← Añadí Link aquí

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("access_token", res.data.access_token);
      setMessage("¡Login exitoso!");
      navigate("/me");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error al iniciar sesión");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ padding: "10px", fontSize: "16px" }} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required style={{ padding: "10px", fontSize: "16px" }} />
        <button type="submit" style={{ padding: "12px", background: "#4ade80", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" }}>
          Iniciar Sesión
        </button>
      </form>

      {message && <p style={{ marginTop: "1rem", textAlign: "center", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}

      {/* ← Este comentario está BIEN porque está dentro del JSX como {/_ comentario _/} */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={{ color: "#4ade80", fontWeight: "bold", textDecoration: "underline" }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}