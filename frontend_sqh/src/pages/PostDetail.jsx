// src/pages/PostDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import useProfileById from "../hooks/useProfileById";
import { FaArrowLeft, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 1. CARGAR EL ID DEL USUARIO LOGUEADO
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await api.get("/profile/me");
        setCurrentUserId(res.data.id);
        console.log("Usuario actual ID:", res.data.id); // Debug
      } catch (err) {
        console.log("No autenticado", err);
      }
    };
    getCurrentUser();
  }, []);

  // 2. CARGAR EL POST
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${postId}`);
        setPost(res.data);
        console.log("Post user_id:", res.data.user_id); // Debug
      } catch (err) {
        setError("Post no encontrado");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // 3. Perfil del autor
  const { profile: author } = useProfileById(post?.user_id || null);

  // Verificar si es el post del usuario actual
  const isMyPost = currentUserId !== null && post !== null && post.user_id === currentUserId;
  
  // Debug para verificar
  useEffect(() => {
    if (currentUserId && post) {
      console.log("¿Es mi post?", isMyPost);
      console.log("currentUserId:", currentUserId, "post.user_id:", post.user_id);
    }
  }, [currentUserId, post, isMyPost]);

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este post para siempre?")) return;
    try {
      await api.delete(`/posts/delete/${postId}`);
      alert("¡Post eliminado!");
      navigate("/me");
    } catch (err) {
      alert("Error al eliminar");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        Cargando...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "red" }}>
        Post no encontrado
      </div>
    );
  }

  const images = post.content || [];
  const nextImage = () => setCurrentImageIndex(i => (i + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(i => (i - 1 + images.length) % images.length);

  const authorUsername = author?.username || "anónimo";
  const authorPhoto = author?.profile_picture_url;

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1rem" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          background: "none", 
          border: "none", 
          color: "#666", 
          fontSize: "1.1rem", 
          cursor: "pointer", 
          marginBottom: "1.5rem" 
        }}
      >
        <FaArrowLeft /> Volver
      </button>

      <div style={{ 
        background: "white", 
        borderRadius: "24px", 
        overflow: "hidden", 
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)" 
      }}>
        {/* IMAGEN */}
        <div style={{ position: "relative", height: "580px", background: "#000" }}>
          <img 
            src={images[currentImageIndex] || "/placeholder.jpg"} 
            alt={post.title} 
            style={{ width: "100%", height: "100%", objectFit: "contain" }} 
          />
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage} 
                style={{ 
                  position: "absolute", 
                  left: "20px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  background: "rgba(0,0,0,0.6)", 
                  color: "white", 
                  border: "none", 
                  width: "56px", 
                  height: "56px", 
                  borderRadius: "50%", 
                  fontSize: "1.8rem", 
                  cursor: "pointer" 
                }}
              >
                ‹
              </button>
              <button 
                onClick={nextImage} 
                style={{ 
                  position: "absolute", 
                  right: "20px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  background: "rgba(0,0,0,0.6)", 
                  color: "white", 
                  border: "none", 
                  width: "56px", 
                  height: "56px", 
                  borderRadius: "50%", 
                  fontSize: "1.8rem", 
                  cursor: "pointer" 
                }}
              >
                ›
              </button>
              <div style={{ 
                position: "absolute", 
                bottom: "24px", 
                left: "50%", 
                transform: "translateX(-50%)", 
                background: "rgba(0,0,0,0.7)", 
                color: "white", 
                padding: "10px 20px", 
                borderRadius: "30px", 
                fontWeight: "600" 
              }}>
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: "3rem" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start", 
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <h1 style={{ fontSize: "3rem", margin: 0, fontWeight: "bold" }}>
              {post.title}
            </h1>

            {/* BOTONES DE EDITAR Y ELIMINAR */}
            {isMyPost && (
              <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
                <button
                  onClick={() => navigate(`/editar-post/${postId}`)}
                  style={{ 
                    background: "#10b981", 
                    color: "white", 
                    border: "none", 
                    padding: "14px 28px", 
                    borderRadius: "50px", 
                    cursor: "pointer", 
                    fontWeight: "bold", 
                    fontSize: "1rem", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#059669"}
                  onMouseLeave={(e) => e.target.style.background = "#10b981"}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={handleDelete}
                  style={{ 
                    background: "#ef4444", 
                    color: "white", 
                    border: "none", 
                    padding: "14px 28px", 
                    borderRadius: "50px", 
                    cursor: "pointer", 
                    fontWeight: "bold", 
                    fontSize: "1rem", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                  onMouseLeave={(e) => e.target.style.background = "#ef4444"}
                >
                  <FaTrashAlt /> Eliminar
                </button>
              </div>
            )}
          </div>

          {/* AUTOR — AHORA CLICABLE AL PERFIL PÚBLICO */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2rem 0" }}>
            {authorPhoto ? (
                <img 
                src={authorPhoto} 
                alt={authorUsername} 
                style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", cursor: "pointer" }}
                onClick={() => navigate(`/profile/@${authorUsername}`)}
                />
            ) : (
                <div 
                style={{ 
                    width: "70px", height: "70px", borderRadius: "50%", background: "#ddd", 
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    fontWeight: "bold", fontSize: "28px", cursor: "pointer"
                }}
                onClick={() => navigate(`/profile/@${authorUsername}`)}
                >
                {authorUsername[0].toUpperCase()}
                </div>
            )}
            <div 
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/@${authorUsername}`)}
            >
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.5rem", color: "#1a1a1a" }}>
                @{authorUsername}
                </p>
                <p style={{ margin: "4px 0 0", color: "#888" }}>
                {new Date(post.created_at).toLocaleDateString("es-CO", { 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                })}
                </p>
            </div>
            </div>

          {/* Descripción */}
          {post.description && (
            <div style={{ 
              fontSize: "1.35rem", 
              lineHeight: "1.9", 
              background: "#f8fafc", 
              padding: "2rem", 
              borderRadius: "20px", 
              borderLeft: "6px solid #10b981", 
              margin: "2rem 0" 
            }}>
              {post.description}
            </div>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "1rem", 
              marginTop: "2rem" 
            }}>
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  style={{ 
                    background: "#10b981", 
                    color: "white", 
                    padding: "12px 24px", 
                    borderRadius: "50px", 
                    fontWeight: "600" 
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}