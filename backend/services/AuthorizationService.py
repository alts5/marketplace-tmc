import jwt
from typing import Annotated
from fastapi import HTTPException, Cookie
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from models import User, TokenData
from datetime import datetime, timezone, timedelta
from pydantic import ValidationError
from starlette import status
from repositories import SettingRepository as Settings
from repositories import UserRepository as Users
from fastapi.security import SecurityScopes


password_hash = PasswordHash.recommended()
SECRET_KEY = Settings.get_jwt_secret()
ALGORITHM = Settings.get_token_algorithm()
TOKEN_LIFETIME = Settings.get_token_lifetime()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def authenticate_user(username, password):
    user = Users.get_user_by_username(username=username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user


def create_token(data):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(seconds=TOKEN_LIFETIME)
    to_encode.update({"exp": expire, "scope": "items"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
        security_scopes: SecurityScopes, token: Annotated[str, Cookie()] = None
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        scope: str = payload.get("scope", "")
        token_scopes = scope.split(" ")
        token_data = TokenData(scopes=token_scopes, username=username)
    except (InvalidTokenError, ValidationError):
        raise credentials_exception
    user = Users.get_user_by_username(username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
            )
    return user

