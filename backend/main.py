from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status, Response, Security
from fastapi.security import OAuth2PasswordRequestForm
from starlette.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from models import User, Token
from routers import Users
from services import AuthorizationService as AuthService
from repositories import SettingRepository as Settings


allowed_urls = ["http://localhost:8080", "http://127.0.0.1:8000"]


app = FastAPI()
app.mount("/front", StaticFiles(directory="../frontend", html=True))
app.include_router(Users.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins = allowed_urls,
    allow_methods = ["*"],
    allow_headers = ["*"]
)



@app.post("/token")
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        response : Response
) -> Token:
    user = AuthService.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = AuthService.create_token(
        data={"sub": user.username}
    )

    response.set_cookie(key="token", value=access_token, httponly=True, max_age=Settings.get_token_lifetime())
    return Token(token=access_token)
