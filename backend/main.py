from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import auth, profiles, posts, test

app = FastAPI(
    title="API de Saberes que Habitan",
    description="API para la gestión de la plataforma para el proyecto Saberes que Habitan",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(posts.router)
app.include_router(test.router)