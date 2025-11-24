// src/pages/Explora.jsx
import { useState, useEffect } from "react";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { FaSearch, FaFire } from "react-icons/fa";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/posts/feed");
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las publicaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // Filtrar por búsqueda (título, descripción o tags)
  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      post.title?.toLowerCase().includes(term) ||
      post.description?.toLowerCase().includes(term) ||
      post.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{
          fontSize: "4rem",
          fontWeight: "900",
          background: "linear-gradient(90deg, #10b981, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 1rem"
        }}>
          Explora
        </h1>
        <p style={{ fontSize: "1.4rem", color: "#666", margin: "0 0 2rem" }}>
          Descubre las mejores artesanías y creaciones de la comunidad
        </p>

        {/* BARRA DE BÚSQUEDA */}
        <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
          <FaSearch style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "1.4rem" }} />
          <input
            type="text"
            placeholder="Busca por título, descripción o #tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "1.2rem 1.5rem 1.2rem 3.5rem",
              fontSize: "1.2rem",
              borderRadius: "50px",
              border: "2px solid #e2e8f0",
              outline: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              transition: "all 0.3s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#10b981"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
      </div>

      {/* ESTADO DE CARGA */}
      {loading && (
        <div style={{ textAlign: "center", padding: "6rem", fontSize: "1.5rem", color: "#666" }}>
          <FaFire style={{ fontSize: "3rem", marginBottom: "1rem", color: "#f59e0b" }} />
          <p>Cargando las mejores publicaciones...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={{ textAlign: "center", padding: "6rem", color: "#ef4444", fontSize: "1.5rem" }}>
          {error}
        </div>
      )}

      {/* GRID DE POSTS */}
      {!loading && !error && (
        <>
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "6rem", color: "#666", fontSize: "1.5rem" }}>
              {searchTerm ? "No se encontraron publicaciones con esa búsqueda" : "Aún no hay publicaciones en el feed"}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "2rem",
              padding: "1rem"
            }}>
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}