// src/pages/PublicProfile.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { FaArrowLeft, FaGlobe, FaPhone, FaCalendarAlt } from "react-icons/fa";

export default function PublicProfile() {
  const { username } = useParams(); // Viene como @juanartesano → quita el @
  const cleanUsername = username?.startsWith("@") ? username.slice(1) : username;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        // 1. Obtener perfil público
        const profileRes = await api.get(`/profile/${cleanUsername}`);
        setProfile(profileRes.data);

        // 2. Obtener sus posts
        const postsRes = await api.get(`/posts/@${cleanUsername}`);
        setPosts(postsRes.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Usuario no encontrado");
        } else {
          setError("Error al cargar el perfil");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [cleanUsername]);

  if (loading) {
    return (
      <div style={{ padding: "6rem", textAlign: "center", fontSize: "1.5rem", color: "#666" }}>
        Cargando perfil...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: "6rem", textAlign: "center", color: "#ef4444", fontSize: "1.8rem" }}>
        {error || "Perfil no encontrado"}
        <button
          onClick={() => navigate(-1)}
          style={{ marginTop: "2rem", padding: "12px 32px", background: "#4ade80", color: "white", border: "none", borderRadius: "50px", cursor: "pointer" }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" }}>
      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          color: "#555",
          fontSize: "1.1rem",
          cursor: "pointer",
          marginBottom: "1.5rem"
        }}
      >
        <FaArrowLeft /> Volver
      </button>

      {/* === PERFIL PÚBLICO === */}
      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "3rem",
        boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
        marginBottom: "3rem",
        textAlign: "center"
      }}>
        {/* FOTO */}
        {profile.profile_picture_url ? (
          <img
            src={profile.profile_picture_url}
            alt={profile.username}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "8px solid #4ade80",
              boxShadow: "0 15px 35px rgba(74,222,128,0.3)"
            }}
          />
        ) : (
          <div style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "#e5e7eb",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "6rem",
            fontWeight: "bold",
            color: "#9ca3af"
          }}>
            {profile.username[0].toUpperCase()}
          </div>
        )}

        {/* INFO */}
        <h1 style={{ margin: "1.5rem 0 0.5rem", fontSize: "3.2rem", fontWeight: "900" }}>
          @{profile.username}
        </h1>
        {profile.full_name && (
          <h3 style={{ color: "#444", margin: "0.5rem 0", fontSize: "1.8rem" }}>
            {profile.full_name}
          </h3>
        )}
        {profile.bio && (
          <p style={{
            fontSize: "1.4rem",
            fontStyle: "italic",
            color: "#555",
            margin: "2rem auto",
            maxWidth: "700px",
            lineHeight: "1.8"
          }}>
            "{profile.bio}"
          </p>
        )}

        {/* DETALLES */}
        <div style={{
          margin: "3rem 0",
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          flexWrap: "wrap",
          fontSize: "1.2rem",
          color: "#666"
        }}>
          {profile.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaPhone /> {profile.phone}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaCalendarAlt /> Miembro desde {new Date(profile.created_at).toLocaleDateString("es-CO")}
          </div>
        </div>

        {/* REDES SOCIALES */}
        {profile.social_links && Object.keys(profile.social_links).length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#444" }}>Redes</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              {Object.entries(profile.social_links).map(([platform, link]) => (
                <a
                  key={platform}
                  href={link.startsWith("http") ? link : `https://${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "12px 28px",
                    background: "#4ade80",
                    color: "white",
                    borderRadius: "50px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1.1rem"
                  }}
                >
                  <FaGlobe style={{ marginRight: "8px" }} />
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* === SUS PUBLICACIONES === */}
      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "3rem",
        boxShadow: "0 20px 50px rgba(0,0,0,0.12)"
      }}>
        <h2 style={{ fontSize: "2.4rem", margin: "0 0 2rem", fontWeight: "bold", textAlign: "center" }}>
          Publicaciones de @{profile.username}
        </h2>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#888" }}>
            <p style={{ fontSize: "1.6rem" }}>Este usuario aún no ha publicado nada</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))"
          }}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}