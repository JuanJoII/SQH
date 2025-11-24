// src/pages/TestAffinity.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { FaArrowLeft, FaArrowRight, FaCrown, FaRedo } from "react-icons/fa";

const questions = [
  {
    id: "q1",
    question: "¿Qué te atrae más al ver una obra artesanal?",
    options: [
      { text: "Los colores y el trazo, me gusta que se vea expresivo.", letter: "a", emoji: "Ilustración" },
      { text: "La fuerza y el metal, me gustan las formas sólidas.", letter: "b", emoji: "Forja" },
      { text: "La textura de la tierra y lo natural.", letter: "c", emoji: "Barro" },
      { text: "Los tejidos o patrones que parecen contar historias.", letter: "d", emoji: "Telas" },
    ],
  },
  {
    id: "q2",
    question: "Si pudieras crear algo con tus manos, sería...",
    options: [
      { text: "Un cuadro o un dibujo lleno de color.", letter: "a", emoji: "Ilustración" },
      { text: "Una lámpara o figura metálica con carácter.", letter: "b", emoji: "Forja" },
      { text: "Una vasija o escultura sencilla pero viva.", letter: "c", emoji: "Vasijas / Barro" },
      { text: "Algo para decorar mi casa, que combine con mi estilo.", letter: "d", emoji: "Decoración" },
    ],
  },
  {
    id: "q3",
    question: "¿Cómo describirías tu espacio ideal?",
    options: [
      { text: "Alegre, lleno de arte y cosas únicas.", letter: "a", emoji: "Ilustración" },
      { text: "Con toques industriales o rústicos.", letter: "b", emoji: "Forja" },
      { text: "Cálido y natural, con tonos tierra.", letter: "c", emoji: "Barro / Vasijas" },
      { text: "Acogedor, con cojines, mantas y texturas.", letter: "d", emoji: "Telas / Decoración" },
    ],
  },
  {
    id: "q4",
    question: "¿Qué valoras más en una pieza artesanal?",
    options: [
      { text: "La historia o mensaje que transmite.", letter: "a", emoji: "Ilustración" },
      { text: "La técnica y el trabajo físico detrás.", letter: "b", emoji: "Forja" },
      { text: "La conexión con la tierra y la tradición.", letter: "c", emoji: "Barro / Vasijas" },
      { text: "Su capacidad para embellecer y transformar espacios.", letter: "d", emoji: "Decoración / Telas" },
    ],
  },
  {
    id: "q5",
    question: "¿Cómo prefieres expresarte?",
    options: [
      { text: "A través del color y la imaginación.", letter: "a", emoji: "Ilustración" },
      { text: "Con algo útil y duradero.", letter: "b", emoji: "Forja" },
      { text: "Con algo que evoque la naturaleza.", letter: "c", emoji: "Barro / Vasijas" },
      { text: "Combinando formas, texturas y detalles.", letter: "d", emoji: "Decoración / Telas" },
    ],
  },
  {
    id: "q6",
    question: "¿Qué tipo de energía te representa mejor?",
    options: [
      { text: "Creativa y soñadora.", letter: "a", emoji: "Ilustración" },
      { text: "Fuerte y determinada.", letter: "b", emoji: "Forja" },
      { text: "Tranquila y terrenal.", letter: "c", emoji: "Barro / Vasijas" },
      { text: "Armoniosa y estética.", letter: "d", emoji: "Decoración / Telas" },
    ],
  },
];

export default function TestAffinity() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const navigate = useNavigate();

  // 1. Verificar si ya hizo el test
  useEffect(() => {
    const checkResult = async () => {
      try {
        const res = await api.get("/test/result");
        setResult(res.data);
      } catch (err) {
        if (err.response?.status === 404) setResult(null);
      } finally {
        setLoading(false);
      }
    };
    checkResult();
  }, []);

  // 2. Cargar posts relacionados cuando tenemos el resultado
  useEffect(() => {
    if (!result || !result.recomended_tags || result.recomended_tags.length === 0) {
      setLoadingPosts(false);
      return;
    }

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const requests = result.recomended_tags.map(tag =>
          api.get(`/posts/tag/${tag}`).catch(() => ({ data: [] }))
        );
        const responses = await Promise.all(requests);
        const posts = responses.flatMap(r => r.data || []);
        const shuffled = posts.sort(() => 0.5 - Math.random()).slice(0, 12);
        setRelatedPosts(shuffled);
      } catch (err) {
        console.error("Error cargando posts relacionados", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [result]);

  const handleAnswer = (letter) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: letter };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers) => {
    setLoading(true);
    try {
      const res = await api.post("/test/affinity", finalAnswers);
      setResult(res.data);
    } catch (err) {
      alert("Error al guardar el resultado");
    } finally {
      setLoading(false);
    }
  };

  const resetTest = async () => {
    if (!confirm("¿Seguro que quieres repetir el test? Se borrará todo.")) return;
    setIsResetting(true);
    try {
      await api.delete("/test/reset");
      setResult(null);
      setCurrentQuestion(0);
      setAnswers({});
      setRelatedPosts([]);
    } catch (err) {
      alert("Error al reiniciar el test");
    } finally {
      setIsResetting(false);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // CARGA INICIAL
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
        Cargando tu afinidad...
      </div>
    );
  }

  // RESULTADO + RECOMENDACIONES
  if (result) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <FaCrown style={{ fontSize: "6rem", color: "#fbbf24" }} />
            <h1 style={{ fontSize: "4.5rem", margin: "1rem 0", fontWeight: "900" }}>
              Tu afinidad es <span style={{ color: "#4ade80" }}>{result.main_affinity}</span>
            </h1>
            <h2 style={{ fontSize: "3rem" }}>{result.emoji} {result.title}</h2>
            <p style={{ fontSize: "1.6rem", maxWidth: "800px", margin: "2rem auto", opacity: 0.9, lineHeight: "1.8" }}>
              {result.description}
            </p>

            {result.unlocked_avatar && (
              <div style={{ margin: "3rem 0" }}>
                {result.unlocked_avatar.is_new && (
                  <p style={{ fontSize: "2rem", color: "#fbbf24", fontWeight: "bold" }}>¡NUEVO AVATAR DESBLOQUEADO!</p>
                )}
                <img
                  src={result.unlocked_avatar.image_url}
                  alt={result.unlocked_avatar.name}
                  style={{ width: "200px", height: "200px", borderRadius: "50%", border: "10px solid #4ade80", boxShadow: "0 25px 50px rgba(74,222,128,0.6)" }}
                />
                <p style={{ fontSize: "1.8rem", marginTop: "1rem", fontWeight: "bold" }}>
                  {result.unlocked_avatar.name}
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: "3rem", textAlign: "center", margin: "4rem 0 3rem", fontWeight: "900" }}>
              Artesanías que te representan
            </h2>

            {loadingPosts ? (
              <p style={{ textAlign: "center", fontSize: "1.6rem", opacity: 0.8 }}>Buscando lo perfecto para ti...</p>
            ) : relatedPosts.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "1.6rem", opacity: 0.8 }}>Pronto habrá más creaciones con tus afinidades</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
                {relatedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "5rem", display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/me")} style={{ padding: "18px 60px", background: "#4ade80", color: "white", border: "none", borderRadius: "50px", fontSize: "1.6rem", fontWeight: "bold", cursor: "pointer" }}>
              Ir a mi perfil
            </button>
            <button onClick={resetTest} disabled={isResetting} style={{ padding: "18px 60px", background: isResetting ? "#64748b" : "#ef4444", color: "white", border: "none", borderRadius: "50px", fontSize: "1.6rem", fontWeight: "bold", cursor: isResetting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaRedo /> {isResetting ? "Borrando..." : "Repetir test"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TEST EN PROGRESO
  const q = questions[currentQuestion];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", color: "white" }}>
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.4rem", opacity: 0.9 }}>Pregunta {currentQuestion + 1} de {questions.length}</div>
          <div style={{ height: "10px", background: "rgba(255,255,255,0.2)", borderRadius: "50px", marginTop: "1rem", overflow: "hidden" }}>
            <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, height: "100%", background: "#4ade80", borderRadius: "50px", transition: "width 0.6s ease" }} />
          </div>
        </div>

        <h1 style={{ fontSize: "3.8rem", fontWeight: "900", textAlign: "center", margin: "0 0 4rem", lineHeight: "1.2" }}>
          {q.question}
        </h1>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.letter)}
              style={{ padding: "2rem", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "20px", color: "white", fontSize: "1.6rem", fontWeight: "600", cursor: "pointer", textAlign: "left", backdropFilter: "blur(12px)", transition: "all 0.3s ease" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              <span style={{ marginRight: "1rem", fontSize: "2rem" }}>{opt.emoji}</span>
              {opt.text}
            </button>
          ))}
        </div>

        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 3rem" }}>
          <button onClick={goBack} disabled={currentQuestion === 0} style={{ pointerEvents: "all", background: currentQuestion === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)", color: "white", border: "none", width: "80px", height: "80px", borderRadius: "50%", fontSize: "2.5rem", cursor: currentQuestion === 0 ? "not-allowed" : "pointer", backdropFilter: "blur(10px)" }}>
            <FaArrowLeft />
          </button>
          <button onClick={() => handleAnswer(answers[q.id] || "a")} style={{ pointerEvents: "all", background: "rgba(255,255,255,0.3)", color: "white", border: "none", width: "80px", height: "80px", borderRadius: "50%", fontSize: "2.5rem", cursor: "pointer", backdropFilter: "blur(10px)" }}>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}