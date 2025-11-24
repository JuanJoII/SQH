// src/components/PostActionsMenu.jsx
import { FaEdit, FaTrash } from "react-icons/fa";

export default function PostActionsMenu({ post, onEdit, onDelete }) {
  if (!post.is_mine) return null; // Solo mostrar si es del usuario actual

  return (
    <div style={{
      position: "absolute",
      top: "12px",
      right: "12px",
      background: "rgba(0,0,0,0.7)",
      borderRadius: "12px",
      padding: "8px",
      display: "flex",
      gap: "8px",
      zIndex: 10,
      backdropFilter: "blur(10px)"
    }}>
      <button
        onClick={() => onEdit(post)}
        style={{
          background: "#8b5cf6",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
        title="Editar publicación"
      >
        <FaEdit />
      </button>
      <button
        onClick={() => onDelete(post)}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
        title="Eliminar publicación"
      >
        <FaTrash />
      </button>
    </div>
  );
}