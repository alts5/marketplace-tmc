from fastapi import FastAPI
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.mount("/front", StaticFiles(directory="../frontend", html=True))

allowed_urls = ["http://localhost:8080", "http://127.0.0.1:8000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins = allowed_urls,
    allow_methods = ["*"],
    allow_headers = ["*"]
)


@app.post("/auth/token")
def auth():
    return JSONResponse(content={"result":"ok"},status_code=401)