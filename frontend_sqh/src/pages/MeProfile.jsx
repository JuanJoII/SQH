// src/pages/MeProfile.jsx
import { useState, useEffect } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { FaMedal, FaLock, FaCrown, FaEdit, FaCamera } from "react-icons/fa";

export default function MeProfile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [affinity, setAffinity] = useState(null);
  const [unlockedAvatars, setUnlockedAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Cargar perfil
        const profileRes = await api.get("/profile/me");
        setProfile(profileRes.data);

        // 2. Cargar posts
        const postsRes = await api.get(`/posts/@${profileRes.data.username}`);
        setPosts(postsRes.data || []);

        // 3. Cargar test de afinidad
        try {
          const testRes = await api.get("/test/result");
          setAffinity(testRes.data);
        } catch (err) {
          if (err.response?.status === 404) {
            setAffinity(null);
          }
        }

        // 4. Cargar avatares desbloqueados
        try {
          const avatarsRes = await api.get("/avatar/unlocked");
          setUnlockedAvatars(avatarsRes.data.collection || []);
        } catch (err) {
          setUnlockedAvatars([]);
        }

      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
        } else {
          setError("Error al cargar datos");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", fontSize: "1.2rem" }}>Cargando perfil...</div>;
  if (error) return <div style={{ padding: "3rem", color: "red", textAlign: "center" }}>{error}</div>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" }}>
      {/* === PERFIL === */}
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "2.5rem",
        boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
        marginBottom: "3rem"
      }}>
        <div style={{ textAlign: "center" }}>
          {profile.profile_picture_url ? (
            <img src={profile.profile_picture_url} alt="Foto" style={{ width: "160px", height: "160px", borderRadius: "50%", objectFit: "cover", border: "6px solid #4ade80" }} />
          ) : (
            <div style={{
              width: "160px", height: "160px", borderRadius: "50%", background: "#e5e7eb",
              margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "5rem", fontWeight: "bold", color: "#9ca3af"
            }}>
              {profile.username[0].toUpperCase()}
            </div>
          )}
          <h1 style={{ margin: "1rem 0 0.5rem", fontSize: "2.8rem", fontWeight: "bold" }}>@{profile.username}</h1>
          {profile.full_name && <h3 style={{ color: "#555", margin: "0.5rem 0" }}>{profile.full_name}</h3>}
          {profile.bio && <p style={{ fontSize: "1.3rem", fontStyle: "italic", color: "#444", margin: "1.5rem 0", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>"{profile.bio}"</p>}
        </div>

        {/* === AFINIDAD === */}
        <div style={{
          margin: "3rem 0",
          padding: "2rem",
          background: affinity ? "linear-gradient(135deg, #4ade80, #22c55e)" : "#f3f4f6",
          borderRadius: "20px",
          textAlign: "center",
          color: "white",
          boxShadow: affinity ? "0 12px 35px rgba(74, 222, 128, 0.4)" : "none"
        }}>
          {affinity ? (
            <>
              <h2 style={{ margin: "0 0 0.8rem", fontSize: "2.2rem" }}>
                Tu afinidad: <strong>{affinity.main_affinity}</strong>
              </h2>
              <p style={{ fontSize: "1.4rem", opacity: 0.95 }}>{affinity.title || "Eres un alma creativa"}</p>
              {affinity.unlocked_avatar && (
                <div style={{ marginTop: "1.5rem" }}>
                  <img src={affinity.unlocked_avatar.image_url} alt="Avatar" style={{ width: "120px", height: "120px", borderRadius: "50%", border: "5px solid white" }} />
                  <p style={{ margin: "0.8rem 0 0", fontSize: "1.1rem" }}>
                    Avatar desbloqueado: <strong>{affinity.unlocked_avatar.name}</strong>
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 style={{ margin: "0 0 1rem", fontSize: "2rem", color: "#374151" }}>
                ¿Cuál es tu afinidad en las artesanías?
              </h2>
              <p style={{ fontSize: "1.3rem", color: "#6b7280", marginBottom: "1.5rem" }}>
                Descubre qué tipo de artesano llevas dentro
              </p>
              <button
                onClick={() => navigate("/test")}
                style={{
                  padding: "16px 40px",
                  background: "#4ade80",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 8px 25px rgba(74, 222, 128, 0.5)"
                }}
              >
                Descubre tu afinidad ahora
              </button>
            </>
          )}
        </div>

        {/* Info adicional */}
        <div style={{ marginTop: "2rem", lineHeight: "1.8", textAlign: "center" }}>
          {profile.phone && <p><strong>Teléfono:</strong> {profile.phone}</p>}
          <p><strong>Miembro desde:</strong> {new Date(profile.created_at).toLocaleDateString("es-CO")}</p>
        </div>

        {/* Redes sociales */}
        {profile.social_links && Object.keys(profile.social_links).length > 0 && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <h3>Mis redes</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {Object.entries(profile.social_links).map(([key, value]) => (
                <a key={key} href={value.startsWith("http") ? value : `https://${value}`} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "12px 24px", background: "#4ade80", color: "white", borderRadius: "50px", textDecoration: "none", fontWeight: "bold" }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* === MIS AVATARES DESBLOQUEADOS === */}
      <div style={{ background: "white", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 15px 40px rgba(0,0,0,0.1)", marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "2rem" }}>Mis Avatares Desbloqueados</h2>
        {unlockedAvatars.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#666" }}>
            <FaLock style={{ fontSize: "4rem", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.8rem" }}>Aún no has desbloqueado avatares</h3>
            <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
              Completa el test de afinidad para desbloquear tu primer avatar
            </p>
            <button
              onClick={() => navigate("/test")}
              style={{
                padding: "14px 40px",
                background: "#4ade80",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Hacer el test
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {unlockedAvatars.map(avatar => (
              <div key={avatar.id} style={{
                textAlign: "center",
                background: "#1e293b",
                color: "white",
                padding: "1.5rem",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
              }}>
                <img src={avatar.image_url} alt={avatar.name} style={{ width: "100%", borderRadius: "50%", marginBottom: "1rem" }} />
                <h3 style={{ fontSize: "1.3rem", margin: "0" }}>{avatar.name}</h3>
                {avatar.affinity && <p style={{ fontSize: "1rem", color: "#4ade80" }}>{avatar.affinity}</p>}

              </div>
            ))}
          </div>
        )}
      </div>

{/* === MIS PUBLICACIONES === */}
<div style={{ background: "white", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}>
  {/* Header con título y botón */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
    <h2 style={{ fontSize: "2.2rem", margin: 0 }}>
      Mis Publicaciones ({posts.length})
    </h2>
    <button 
      onClick={() => navigate("/crear-post")} 
      style={{ 
        padding: "14px 32px", 
        background: "#4ade80", 
        color: "white", 
        border: "none", 
        borderRadius: "50px", 
        fontSize: "1.1rem",
        fontWeight: "bold", 
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#22c55e";
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 6px 16px rgba(74, 222, 128, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#4ade80";
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 12px rgba(74, 222, 128, 0.3)";
      }}
    >
      + Crear nueva publicación
    </button>
  </div>

        {/* Contenido */}
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#666" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📝</div>
            <h3 style={{ fontSize: "1.8rem", color: "#64748b", marginBottom: "1rem" }}>
              Aún no has publicado nada
            </h3>
            <p style={{ fontSize: "1.2rem", margin: "1rem 0", color: "#94a3b8" }}>
              ¡Comparte tu primer proyecto con la comunidad!
            </p>
            <button 
              onClick={() => navigate("/crear-post")} 
              style={{ 
                padding: "16px 48px", 
                background: "#4ade80", 
                color: "white", 
                border: "none", 
                borderRadius: "50px", 
                fontSize: "1.2rem",
                fontWeight: "bold", 
                cursor: "pointer",
                marginTop: "1rem",
                boxShadow: "0 6px 20px rgba(74, 222, 128, 0.4)"
              }}
            >
              Comienza a publicar ahora
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}