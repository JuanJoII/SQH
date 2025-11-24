// src/components/RegisterForm.jsx
import { useState } from "react";
import api from "../api/client";
import { useNavigate, Link } from "react-router-dom";  // ← Añadí Link aquí

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
    bio: "",
    phone: "",
    social_links: {
      instagram: "",
      facebook: "",
      tiktok: "",
      website: "",
    },
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si es un campo dentro de social_links
    if (name.startsWith("social_")) {
      const platform = name.split("_")[1];
      setForm({
        ...form,
        social_links: {
          ...form.social_links,
          [platform]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Filtrar social_links vacíos (opcional, para no enviar campos vacíos)
    const cleanedSocialLinks = Object.fromEntries(
      Object.entries(form.social_links).filter(([_, value]) => value.trim() !== "")
    );

    const payload = {
      ...form,
      social_links: Object.keys(cleanedSocialLinks).length > 0 ? cleanedSocialLinks : null,
    };

    try {
      const res = await api.post("/auth/register", payload);
      setMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
      console.log("Usuario creado:", res.data);

      // Opcional: redirigir al login
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Error al registrarse";
      setMessage(`Error: ${errorMsg}`);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña *"
          value={form.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        <input
          name="username"
          type="text"
          placeholder="Nombre de usuario *"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="full_name"
          type="text"
          placeholder="Nombre completo"
          value={form.full_name}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Bio (opcional)"
          value={form.bio}
          onChange={handleChange}
          rows="3"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
        />

        <h4>Redes sociales (opcional)</h4>
        <input
          name="social_instagram"
          type="text"
          placeholder="Instagram (ej: @tuusuario)"
          value={form.social_links.instagram}
          onChange={handleChange}
        />
        <input
          name="social_facebook"
          type="text"
          placeholder="Facebook"
          value={form.social_links.facebook}
          onChange={handleChange}
        />
        <input
          name="social_tiktok"
          type="text"
          placeholder="TikTok"
          value={form.social_links.tiktok}
          onChange={handleChange}
        />
        <input
          name="social_website"
          type="url"
          placeholder="Sitio web"
          value={form.social_links.website}
          onChange={handleChange}
        />

            <button type="submit" style={{ padding: "10px", fontSize: "16px" }}>
            Registrarse
            </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: message.includes("Error") ? "red" : "green", textAlign: "center" }}>
          {message}
        </p>
      )}

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "#4ade80", fontWeight: "bold", textDecoration: "underline" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}