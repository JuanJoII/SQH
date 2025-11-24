// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import MeProfile from "./pages/MeProfile";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Explore from "./pages/Explora";
import PublicProfile from "./pages/PublicProfile";
import TestAffinity from "./pages/TestAffinity";

function App() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "90px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route 
            path="/me" 
            element={
              <ProtectedRoute>
                <MeProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/crear-post" element={<CreatePost />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/profile/:username" element={<PublicProfile />} />
          <Route path="/profile/@:username" element={<PublicProfile />} />
          {/* Rutas del header (temporal) */}
          <Route path="/test" element={<TestAffinity/>} />
          <Route path="/blog" element={<div style={{padding: "2rem"}}><h1>Blog</h1></div>} />
          <Route path="/eventos" element={<div style={{padding: "2rem"}}><h1>Eventos</h1></div>} />
          <Route path="/explora" element={<Explore/>} />
          <Route path="/ar" element={<div style={{padding: "2rem"}}><h1>Realidad Aumentada</h1></div>} />
          <Route path="/sobre-nosotros" element={<div style={{padding: "2rem"}}><h1>Sobre Nosotros</h1></div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;   // ← ¡¡ESTO ES LO QUE FALTABA!!