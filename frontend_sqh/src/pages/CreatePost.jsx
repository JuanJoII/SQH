// src/pages/CreatePost.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { FaPlus, FaTimes, FaMagic, FaArrowLeft } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // Archivos seleccionados
  const [previewImages, setPreviewImages] = useState([]); // Vista previa
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // CARGAR TAGS SUGERIDOS
  useEffect(() => {
    const fetchSuggestedTags = async () => {
      try {
        const res = await api.get("/tags/popular");
        console.log("Tags populares:", res.data);
        setSuggestedTags(res.data || []);
      } catch (err) {
        console.log("No se pudieron cargar tags, usando por defecto");
        // Tags por defecto si falla
        setSuggestedTags([
          "ornamentación",
          "cerámica",
          "ilustración",
          "forja",
          "tejido",
          "reciclado",
          "naturaleza",
          "ancestral",
          "wayuu",
          "artesanía"
        ]);
      }
    };
    fetchSuggestedTags();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limitar a máximo 10 imágenes
    if (files.length > 10) {
      alert("Máximo 10 imágenes permitidas");
      return;
    }

    setImages(files);

    // Crear previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    const trimmedTag = customTag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setCustomTag("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setMessage("El título es obligatorio");
      return;
    }
    
    if (images.length === 0) {
      setMessage("Debes subir al menos una imagen");
      return;
    }

    setUploading(true);
    setMessage("Subiendo imágenes...");

    try {
      // 1. Subir todas las imágenes a Supabase
      const imageUrls = [];
      for (const image of images) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error } = await supabase.storage
          .from("posts-images")
          .upload(`public/${fileName}`, image);

        if (error) throw error;

        const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/posts-images/public/${fileName}`;
        imageUrls.push(publicUrl);
      }

      // 2. Crear el post con content = [urls de imágenes]
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        content: imageUrls,
        tags: selectedTags
      };

      console.log("Creando post con payload:", payload);
      await api.post("/posts/", payload);
      
      setMessage("¡Post creado con éxito!");
      setTimeout(() => navigate("/me"), 1500);

    } catch (err) {
      console.error("Error al crear post:", err);
      setMessage(err.response?.data?.detail || "Error al crear el post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1rem" }}>
      {/* Botón volver */}
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

      <h1 style={{ 
        fontSize: "3.5rem", 
        fontWeight: "900", 
        textAlign: "center", 
        marginBottom: "2rem",
        color: "#1e293b"
      }}>
        Crear Nueva Artesanía
      </h1>

      <form 
        onSubmit={handleSubmit} 
        style={{ 
          background: "white", 
          borderRadius: "24px", 
          padding: "3rem", 
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)" 
        }}
      >
        {/* TÍTULO */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ 
            fontSize: "1.4rem", 
            fontWeight: "bold", 
            display: "block", 
            marginBottom: "0.8rem",
            color: "#1e293b"
          }}>
            Título del proyecto *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Mi macetero de barro con diseño prehispánico"
            style={{ 
              width: "100%", 
              padding: "1rem", 
              fontSize: "1.3rem", 
              borderRadius: "12px", 
              border: "2px solid #e2e8f0", 
              outline: "none",
              transition: "border-color 0.3s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#4ade80"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            required
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ 
            fontSize: "1.4rem", 
            fontWeight: "bold", 
            display: "block", 
            marginBottom: "0.8rem",
            color: "#1e293b"
          }}>
            Descripción (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cuéntanos sobre tu proceso, materiales o inspiración..."
            rows="4"
            style={{ 
              width: "100%", 
              padding: "1rem", 
              fontSize: "1.2rem", 
              borderRadius: "12px", 
              border: "2px solid #e2e8f0", 
              outline: "none", 
              resize: "vertical",
              transition: "border-color 0.3s",
              fontFamily: "inherit"
            }}
            onFocus={(e) => e.target.style.borderColor = "#4ade80"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        {/* IMÁGENES */}
        <div style={{ marginBottom: "3rem" }}>
          <label style={{ 
            fontSize: "1.4rem", 
            fontWeight: "bold", 
            display: "block", 
            marginBottom: "0.8rem",
            color: "#1e293b"
          }}>
            Imágenes * (máx 10)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ 
              marginBottom: "1rem",
              padding: "0.8rem",
              width: "100%",
              border: "2px dashed #e2e8f0",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
            required
          />
          {previewImages.length > 0 && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
              gap: "1rem",
              marginTop: "1.5rem"
            }}>
              {previewImages.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img 
                    src={src} 
                    alt={`preview ${i + 1}`} 
                    style={{ 
                      width: "100%", 
                      height: "200px", 
                      objectFit: "cover", 
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }} 
                  />
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "#4ade80",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "50px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                  }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAGS SUGERIDOS */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            marginBottom: "1rem" 
          }}>
            <FaMagic style={{ color: "#8b5cf6", fontSize: "1.3rem" }} />
            <h3 style={{ fontSize: "1.6rem", fontWeight: "bold", margin: 0, color: "#1e293b" }}>
              Tags sugeridos para ti
            </h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            {suggestedTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "0.8rem 1.4rem",
                  background: selectedTags.includes(tag) ? "#4ade80" : "#f1f5f9",
                  color: selectedTags.includes(tag) ? "white" : "#334155",
                  border: "none",
                  borderRadius: "50px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontSize: "1rem"
                }}
                onMouseEnter={(e) => {
                  if (!selectedTags.includes(tag)) {
                    e.target.style.background = "#e2e8f0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedTags.includes(tag)) {
                    e.target.style.background = "#f1f5f9";
                  }
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* TAGS PERSONALIZADOS */}
        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.6rem", fontWeight: "bold", marginBottom: "1rem", color: "#1e293b" }}>
            Tus tags personalizados ({selectedTags.length})
          </h3>
          
          {selectedTags.length > 0 && (
            <div style={{ 
              display: "flex", 
              gap: "0.8rem", 
              flexWrap: "wrap", 
              marginBottom: "1rem" 
            }}>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  style={{
                    background: "#4ade80",
                    color: "white",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "1rem"
                  }}
                >
                  #{tag}
                  <FaTimes
                    style={{ cursor: "pointer", fontSize: "0.9rem" }}
                    onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                  />
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.8rem" }}>
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
              placeholder="Añade tu propio tag..."
              style={{ 
                flex: 1, 
                padding: "1rem", 
                fontSize: "1.2rem", 
                borderRadius: "12px", 
                border: "2px solid #e2e8f0",
                outline: "none"
              }}
            />
            <button
              type="button"
              onClick={addCustomTag}
              style={{ 
                padding: "1rem 2rem", 
                background: "#8b5cf6", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                fontWeight: "bold", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "1rem",
                transition: "background 0.3s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#7c3aed"}
              onMouseLeave={(e) => e.target.style.background = "#8b5cf6"}
            >
              <FaPlus /> Añadir
            </button>
          </div>
        </div>

        {/* MENSAJE */}
        {message && (
          <div style={{
            padding: "1rem",
            marginBottom: "2rem",
            textAlign: "center",
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: message.includes("éxito") ? "#22c55e" : "#ef4444",
            background: message.includes("éxito") ? "#f0fdf4" : "#fef2f2",
            borderRadius: "12px",
            border: `2px solid ${message.includes("éxito") ? "#22c55e" : "#ef4444"}`
          }}>
            {message}
          </div>
        )}

        {/* BOTÓN PUBLICAR */}
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={uploading || !title.trim() || images.length === 0}
            style={{
              padding: "1.5rem 5rem",
              background: uploading || !title.trim() || images.length === 0 ? "#94a3b8" : "#4ade80",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "1.8rem",
              fontWeight: "bold",
              cursor: uploading || !title.trim() || images.length === 0 ? "not-allowed" : "pointer",
              boxShadow: uploading || !title.trim() || images.length === 0 ? "none" : "0 15px 35px rgba(74,222,128,0.5)",
              transition: "all 0.3s"
            }}
          >
            {uploading ? "Publicando..." : "Publicar Artesanía ✨"}
          </button>
        </div>
      </form>
    </div>
  );
}