// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  FaQuestionCircle, FaBlog, FaCalendarAlt, 
  FaCompass, FaVrCardboard, FaUsers, FaUserCircle 
} from "react-icons/fa";

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  borderRadius: "8px",
};

const dropdownItemStyle = {
  display: "block",
  width: "100%",
  padding: "14px 20px",
  background: "none",
  border: "none",
  color: "white",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "15px",
};

export default function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header style={{
      backgroundColor: "#1a1a1a",
      color: "white",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      minHeight: "70px",
      display: "flex",
      alignItems: "center"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative"
      }}>
        {/* Logo */}
        <Link to="/" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <div style={{
            backgroundColor: "#333",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "bold"
          }}>
            A
          </div>
        </Link>

        {/* Menús */}
        <nav style={{ display: "flex", gap: "2rem" }}>
          <Link to="/test" style={linkStyle}>Test</Link>
          <Link to="/blog" style={linkStyle}>Blog</Link>
          <Link to="/eventos" style={linkStyle}>Eventos</Link>
        </nav>

        <nav style={{ display: "flex", gap: "2rem" }}>
          <Link to="/explora" style={linkStyle}>Explora</Link>
          <Link to="/ar" style={linkStyle}>Realidad Aumentada</Link>
          <Link to="/sobre-nosotros" style={linkStyle}>Sobre Nosotros</Link>
        </nav>

        {/* === DROPDOWN QUE SÍ FUNCIONA === */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          {/* Área invisible que mantiene el hover */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "60px",
              height: "80px",  // ← cubre desde el icono hasta el dropdown
              cursor: "pointer",
            }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          />

          {/* Icono visible */}
          <FaUserCircle 
            size={46} 
            style={{ 
              position: "relative",
              zIndex: 2,
              color: token ? "#4ade80" : "white"
            }}
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div 
              style={{
                position: "absolute",
                top: "70px",     // ← justo debajo del área invisible
                right: 0,
                backgroundColor: "#2a2a2a",
                minWidth: "200px",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                overflow: "hidden",
                zIndex: 1001,
              }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {token ? (
                <>
                  <button
                    onClick={() => { navigate("/me"); setDropdownOpen(false); }}
                    style={dropdownItemStyle}
                    onMouseEnter={e => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                    onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{...dropdownItemStyle, color: "#ff6b6b"}}
                    onMouseEnter={e => e.target.style.backgroundColor = "rgba(255,107,107,0.2)"}
                    onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)}
                    onMouseEnter={e => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                    onMouseLeave={e => e.target.style.backgroundColor = "transparent"}>
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)}
                    onMouseEnter={e => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                    onMouseLeave={e => e.target.style.backgroundColor = "transparent"}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}