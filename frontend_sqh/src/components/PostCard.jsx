// src/components/PostCard.jsx
import { useNavigate } from "react-router-dom";
import useProfileById from "../hooks/useProfileById";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function PostCard({ post, onEdit, onDelete, isMine = false }) {
  const navigate = useNavigate();
  const { profile, loading } = useProfileById(post.user_id);

  const username = profile?.username || "anónimo";
  const profilePicture = profile?.profile_picture_url;
  const mainImage = post.content?.[0] || "/placeholder-post.jpg";

  const handleCardClick = (e) => {
    // Evitar navegación si se hace clic en los botones de acción
    if (e.target.closest(".post-actions")) return;
    navigate(`/post/${post.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(post);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(post);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        background: "white",
        transition: "all 0.35s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* MENÚ DE ACCIONES (solo si es del usuario) */}
      {isMine && (
        <div
          className="post-actions"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(0,0,0,0.75)",
            borderRadius: "12px",
            padding: "8px",
            display: "flex",
            gap: "8px",
            zIndex: 10,
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleEdit}
            style={{
              background: "#8b5cf6",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
            title="Eliminar"
          >
            <FaTrash />
          </button>
        </div>
      )}

      {/* IMAGEN */}
      <div style={{ position: "relative", height: "260px", overflow: "hidden" }}>
        <img
          src={mainImage}
          alt={post.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease"
          }}
        />

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            display: "flex",
            gap: "8px",
            flexWrap: "wrap"
          }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div style={{ padding: "1.2rem", flexGrow: 1 }}>
        <h3 style={{ margin: "0 0 0.6rem", fontSize: "1.35rem", fontWeight: "bold" }}>
          {post.title}
        </h3>

        {/* AUTOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "auto" }}>
          {loading ? (
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e0e0e0" }} />
          ) : profilePicture ? (
            <img
              src={profilePicture}
              alt={username}
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#777"
            }}>
              {username[0].toUpperCase()}
            </div>
          )}

          <div>
            <p style={{ margin: 0, fontWeight: "600" }}>@{username}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
              {new Date(post.created_at).toLocaleDateString("es-CO")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}