import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db_mongo import init_mongo
from routers import auth, questions, stats, admin, comments

app = FastAPI(title="DevQuiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5175", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await init_mongo()


app.include_router(auth.router,      prefix="/api/auth")
app.include_router(questions.router, prefix="/api/questions")
app.include_router(stats.router,     prefix="/api/stats")
app.include_router(admin.router,     prefix="/api/admin")
app.include_router(comments.router,  prefix="/api/questions")


@app.get("/")
def root():
    return {"status": "DevQuiz API running"}
